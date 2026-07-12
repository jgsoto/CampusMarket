package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.uce.campusmarket.marketplace.domain.model.Listing;

import java.util.List;
import java.util.UUID;

public interface JpaListingRepository extends JpaRepository<ListingJpaEntity, UUID> {

    @Override
    @EntityGraph(attributePaths = {"category", "images"})
    List<ListingJpaEntity> findAll();

    List<Listing> findByStatusIn(List<String> statuses);


}