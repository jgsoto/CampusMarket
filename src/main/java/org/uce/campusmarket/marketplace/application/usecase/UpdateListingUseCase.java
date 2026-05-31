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

import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingImage;

import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;

import org.uce.campusmarket.marketplace.infrastructure.storage.SupabaseStorageService;

import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.shared.exception.DomainException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateListingUseCase {

    private final ListingRepository listingRepository;
    private final SupabaseStorageService storageService;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public ListingResponse execute(
            UUID listingId,
            UUID requesterId,
            UpdateListingRequest request
    ) {

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() ->
                        new DomainException("La publicación no existe")
                );

        if (!listing.getOwnerId().equals(requesterId)) {
            throw new DomainException(
                    "No tienes permiso para editar esta publicación"
            );
        }

        ListingTitle newTitle =
                new ListingTitle(request.getTitle());

        ListingDescription newDescription =
                new ListingDescription(request.getDescription());

        Price newPrice =
                Price.of(request.getPrice());

        listing.updateDetails(
                newTitle,
                newDescription,
                newPrice
        );

        List<MultipartFile> newImages = request.getImages();

        boolean hasRealFiles =
                newImages != null &&
                        newImages.stream().anyMatch(file -> !file.isEmpty());

        if (hasRealFiles) {

            listing.getImages().forEach(image ->
                    storageService.delete(image.getUrl())
            );

            listing.getImages().clear();

            for (int i = 0; i < newImages.size(); i++) {

                MultipartFile file = newImages.get(i);

                if (!file.isEmpty()) {

                    String imageUrl =
                            storageService.upload(file);

                    ListingImage listingImage =
                            new ListingImage(
                                    UUID.randomUUID(),
                                    imageUrl,
                                    i == 0
                            );

                    listing.addImage(listingImage);
                }
            }
        }

        Listing updatedListing =
                listingRepository.save(listing);

        User seller = userRepository
                .findById(updatedListing.getOwnerId())
                .orElse(null);

        Double averageRating =
                reviewRepository.getAverageRatingByReviewedUserId(
                        updatedListing.getOwnerId()
                );

        Integer totalReviews =
                reviewRepository.countByReviewedUserId(
                        updatedListing.getOwnerId()
                );

        List<ListingImageResponse> images =
                updatedListing.getImages()
                        .stream()
                        .map(img -> new ListingImageResponse(
                                img.getUrl(),
                                img.isThumbnail()
                        ))
                        .toList();

        return new ListingResponse(
                updatedListing.getId(),
                updatedListing.getTitle().getValue(),
                updatedListing.getDescription().getValue(),
                updatedListing.getPrice().getValue().doubleValue(),
                updatedListing.getCategory().getName(),
                updatedListing.getOwnerId(),
                updatedListing.getStatus().name(),
                updatedListing.getCreatedAt(),
                images,
                seller != null ? seller.getFullName() : "Desconocido",
                seller != null ? seller.getEmail() : "No disponible",
                seller != null ? seller.getPhone() : "No disponible",
                seller != null ? seller.getAddress() : "No disponible",
                seller != null ? seller.getSocialMedia() : "No disponible",
                averageRating,
                totalReviews
        );
    }
}