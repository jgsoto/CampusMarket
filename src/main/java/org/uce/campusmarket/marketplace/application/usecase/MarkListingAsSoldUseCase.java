package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MarkListingAsSoldUseCase {

    private final ListingRepository listingRepository;

    public void execute(UUID listingId, UUID ownerId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

        if (!listing.getOwnerId().equals(ownerId)) {
            throw new DomainException("No tienes permiso para modificar esta publicación");
        }

        listing.markAsSold();
        listingRepository.save(listing);
    }
}
