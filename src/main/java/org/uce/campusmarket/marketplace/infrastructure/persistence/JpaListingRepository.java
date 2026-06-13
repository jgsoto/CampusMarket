package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaListingRepository extends JpaRepository<ListingJpaEntity, UUID> {
}
