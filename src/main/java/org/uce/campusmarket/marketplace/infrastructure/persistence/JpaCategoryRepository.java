package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface JpaCategoryRepository extends JpaRepository<CategoryJpaEntity, UUID> {
}
