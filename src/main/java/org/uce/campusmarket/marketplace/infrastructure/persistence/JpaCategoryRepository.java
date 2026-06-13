package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JpaCategoryRepository extends JpaRepository<CategoryJpaEntity, UUID> {
}
