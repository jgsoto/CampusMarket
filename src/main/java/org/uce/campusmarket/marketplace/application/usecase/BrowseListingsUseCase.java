package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BrowseListingsUseCase {

    private final ListingRepository listingRepository;

    public BrowseListingsUseCase(
            ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<ListingResponse> execute() {

        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .filter(listing ->
                        listing.getStatus() == org.uce.campusmarket.marketplace.domain.model.ListingStatus.PUBLICADA ||
                                listing.getStatus() == org.uce.campusmarket.marketplace.domain.model.ListingStatus.VENDIDO
                )
                .map(listing -> {

                    List<ListingImageResponse> images = listing.getImages()
                            .stream()
                            .map(img -> new ListingImageResponse(
                                    img.getUrl(),
                                    img.isThumbnail()
                            ))
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
                            .build();
                })
                .collect(Collectors.toList());
    }
}