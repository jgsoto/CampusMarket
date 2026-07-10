package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.application.dto.UpdateListingRequest;
import org.uce.campusmarket.marketplace.application.port.ImageStoragePort;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingImage;

import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;


import org.uce.campusmarket.shared.exception.DomainException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateListingUseCase {

    private final ListingRepository listingRepository;
    private final ImageStoragePort imageStoragePort;
    private final UserRepository userRepository;

    public ListingResponse execute(
            UUID listingId,
            UUID requesterId,
            UpdateListingRequest request) {

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

        if (!listing.getOwnerId().equals(requesterId)) {
            throw new DomainException(
                    "No tienes permiso para editar esta publicación");
        }

        ListingTitle newTitle = new ListingTitle(request.getTitle());

        ListingDescription newDescription = new ListingDescription(request.getDescription());

        Price newPrice = Price.of(request.getPrice());

        listing.updateDetails(
                newTitle,
                newDescription,
                newPrice);

        List<String> retainedUrls = request.getRetainedImageUrls() != null ? request.getRetainedImageUrls() : new java.util.ArrayList<>();
        List<MultipartFile> newImages = request.getImages();

        List<ListingImage> currentImages = new java.util.ArrayList<>(listing.getImages());
        List<ListingImage> keptImages = new java.util.ArrayList<>();

        for (ListingImage img : currentImages) {
            if (retainedUrls.contains(img.getUrl())) {
                keptImages.add(img);
            } else {
                imageStoragePort.delete(img.getUrl());
            }
        }

        boolean hasRealFiles = newImages != null &&
                newImages.stream().anyMatch(file -> !file.isEmpty());

        if (hasRealFiles) {
            for (MultipartFile file : newImages) {
                if (!file.isEmpty()) {
                    String imageUrl = imageStoragePort.upload(file);
                    ListingImage listingImage = new ListingImage(
                            UUID.randomUUID(),
                            imageUrl,
                            false);
                    keptImages.add(listingImage);
                }
            }
        }

        List<ListingImage> finalImages = new java.util.ArrayList<>();
        for (int i = 0; i < keptImages.size(); i++) {
            ListingImage img = keptImages.get(i);
            boolean isThumbnail = (i == 0);
            if (img.isThumbnail() != isThumbnail) {
                finalImages.add(new ListingImage(img.getId(), img.getUrl(), isThumbnail));
            } else {
                finalImages.add(img);
            }
        }

        listing.replaceImages(finalImages);

        Listing updatedListing = listingRepository.save(listing);

        User seller = userRepository
                .findById(updatedListing.getOwnerId())
                .orElse(null);

        List<ListingImageResponse> images = updatedListing.getImages()
                .stream()
                .map(img -> new ListingImageResponse(
                        img.getUrl(),
                        img.isThumbnail()))
                .toList();

        return ListingResponse.builder()
                .id(updatedListing.getId())
                .title(updatedListing.getTitle().getValue())
                .description(updatedListing.getDescription().getValue())
                .price(updatedListing.getPrice().getValue().doubleValue())
                .categoryName(updatedListing.getCategory().getName())
                .ownerId(updatedListing.getOwnerId())
                .status(updatedListing.getStatus().name())
                .createdAt(updatedListing.getCreatedAt())
                .images(images)
                .sellerName(seller != null ? seller.getFullName() : "Desconocido")
                .sellerEmail(seller != null ? seller.getEmail() : "No disponible")
                .sellerPhone(seller != null ? seller.getPhone() : "No disponible")
                .sellerAddress(seller != null ? seller.getAddress() : "No disponible")
                .sellerSocialMedia(seller != null ? seller.getSocialMedia() : "No disponible")
                .sellerPhotoUrl(seller != null ? seller.getPhotoUrl() : null)
                .build();
    }
}