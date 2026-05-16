package org.uce.campusmarket.marketplace.domain.repository;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ListingRepository {
    Listing save(Listing listing);
    Optional<Listing> findById(UUID id);
    List<Listing> findAll();
    void deleteById(UUID id);
}
