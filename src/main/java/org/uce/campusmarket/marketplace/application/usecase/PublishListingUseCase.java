package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@Transactional
public class PublishListingUseCase {

    private final ListingRepository listingRepository;

    public PublishListingUseCase(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public void execute(UUID listingId, UUID requesterId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

        if (!listing.getOwnerId().equals(requesterId)) {
            throw new DomainException("No tienes permiso para publicar esta publicación");
        }

        listing.publish();
        listingRepository.save(listing);
    }
}
