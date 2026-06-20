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

import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMyListingsUseCase {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

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

                    Double averageRating = reviewRepository.getAverageRatingByReviewedUserId(
                            listing.getOwnerId());

                    Integer totalReviews = reviewRepository.countByReviewedUserId(
                            listing.getOwnerId());

                    return new ListingResponse(
                            listing.getId(),
                            listing.getTitle().getValue(),
                            listing.getDescription().getValue(),
                            listing.getPrice().getValue().doubleValue(),
                            listing.getCategory().getName(),
                            listing.getOwnerId(),
                            listing.getStatus().name(),
                            listing.getCreatedAt(),
                            images,
                            seller != null ? seller.getFullName() : "Desconocido",
                            seller != null ? seller.getEmail() : "No disponible",
                            seller != null ? seller.getPhone() : "No disponible",
                            seller != null ? seller.getAddress() : "No disponible",
                            seller != null ? seller.getSocialMedia() : "No disponible",
                            averageRating,
                            totalReviews);
                })
                .collect(Collectors.toList());
    }
}