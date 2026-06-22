package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BrowseListingsUseCase {

    private final ListingRepository listingRepository;
    private final ReviewRepository reviewRepository;

    public BrowseListingsUseCase(
            ListingRepository listingRepository,
            ReviewRepository reviewRepository) {
        this.listingRepository = listingRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<ListingResponse> execute() {

        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .filter(listing -> listing
                        .getStatus() == ListingStatus.PUBLICADA
                        ||
                        listing.getStatus() == ListingStatus.VENDIDO)
                .map(listing -> {

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
                            null,
                            null,
                            null,
                            null,
                            null,
                            averageRating,
                            totalReviews);
                })
                .collect(Collectors.toList());
    }
}