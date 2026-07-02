package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMyListingsUseCase {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;


    public List<ListingResponse> execute(UUID ownerId) {

        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .filter(listing -> listing.getOwnerId().equals(ownerId))
                .map(listing -> {

                    User seller = userRepository.findById(
                            listing.getOwnerId()).orElse(null);

                    List<ListingImageResponse> images = listing.getImages()
                            .stream()
                            .map(img -> new ListingImageResponse(
                                    img.getUrl(),
                                    img.isThumbnail()))
                            .toList();

                    return ListingResponse.builder()
                            .id(listing.getId())
                            .title(listing.getTitle().getValue())
                            .description(listing.getDescription().getValue())
                            .price(listing.getPrice().getValue().doubleValue())
                            .categoryName(listing.getCategory().getName())
                            .ownerId(listing.getOwnerId())
                            .status(listing.getStatus().name())
                            .createdAt(listing.getCreatedAt())
                            .images(images)
                            .sellerName(seller != null ? seller.getFullName() : "Desconocido")
                            .sellerEmail(seller != null ? seller.getEmail() : "No disponible")
                            .sellerPhone(seller != null ? seller.getPhone() : "No disponible")
                            .sellerAddress(seller != null ? seller.getAddress() : "No disponible")
                            .sellerSocialMedia(seller != null ? seller.getSocialMedia() : "No disponible")
                            .sellerPhotoUrl(seller != null ? seller.getPhotoUrl() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }
}