package org.uce.campusmarket.reputation.infraestructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewJpaRepository
        extends JpaRepository<ReviewJpaEntity, UUID> {

    List<ReviewJpaEntity> findByReviewedUserId(
            UUID reviewedUserId
    );

    boolean existsByReviewerIdAndTargetId(
            UUID reviewerId,
            UUID targetId
    );
}