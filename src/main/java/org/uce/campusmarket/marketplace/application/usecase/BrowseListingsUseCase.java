package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BrowseListingsUseCase {

    private final ListingRepository listingRepository;

    public BrowseListingsUseCase(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<ListingResponse> execute() {
        List<Listing> listings = listingRepository.findAll();

        return listings.stream()
                .map(listing -> new ListingResponse(
                        listing.getId(),
                        listing.getTitle().getValue(),
                        listing.getDescription().getValue(),
                        listing.getPrice().getValue().doubleValue(),
                        listing.getCategory().getName(),
                        listing.getOwnerId(),
                        listing.getStatus().name(),
                        listing.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}
