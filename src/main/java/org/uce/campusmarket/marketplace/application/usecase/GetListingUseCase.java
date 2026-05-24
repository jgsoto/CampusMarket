package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class GetListingUseCase {

    private final ListingRepository listingRepository;

    public GetListingUseCase(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public ListingResponse execute(UUID listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

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
    }
}
