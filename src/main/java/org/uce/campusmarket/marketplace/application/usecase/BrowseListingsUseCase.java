package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;
import lombok.RequiredArgsConstructor;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrowseListingsUseCase {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

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

                    User seller = userRepository
                            .findById(listing.getOwnerId())
                            .orElse(null);

                    double reputation = reviewRepository
                            .getAverageRatingByReviewedUserId(listing.getOwnerId());

                    int reviewCount = reviewRepository
                            .countByReviewedUserId(listing.getOwnerId());

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
                            .sellerEmail(seller != null ? seller.getEmail() : "")
                            .sellerPhone(seller != null ? seller.getPhone() : "")
                            .sellerAddress(seller != null ? seller.getAddress() : "")
                            .sellerSocialMedia(seller != null ? seller.getSocialMedia() : "")

                            .sellerReputation(reputation)
                            .sellerReviewCount(reviewCount)
                            .build();
                })
                .collect(Collectors.toList());
    }
}