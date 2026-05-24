package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface JpaOrderRepository extends JpaRepository<OrderJpaEntity, UUID> {
    List<OrderJpaEntity> findByBuyerId(UUID buyerId);
}
