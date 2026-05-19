package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class GetMyListingsUseCase {

    private final ListingRepository listingRepository;

    public GetMyListingsUseCase(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<ListingResponse> execute(UUID ownerId) {

        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .filter(listing ->
                        listing.getOwnerId().equals(ownerId)
                                && listing.getStatus() != ListingStatus.ELIMINADO
                )
                .map(listing -> {

                    List<ListingImageResponse> images = listing.getImages()
                            .stream()
                            .map(img -> new ListingImageResponse(
                                    img.getUrl(),
                                    img.isThumbnail()
                            ))
                            .toList();

                    return new ListingResponse(
                            listing.getId(),
                            listing.getTitle().getValue(),
                            listing.getDescription().getValue(),
                            listing.getPrice().getValue().doubleValue(),
                            listing.getCategory().getName(),
                            listing.getOwnerId(),
                            listing.getStatus().name(),
                            listing.getCreatedAt(),
                            images
                    );
                })
                .collect(Collectors.toList());
    }
}