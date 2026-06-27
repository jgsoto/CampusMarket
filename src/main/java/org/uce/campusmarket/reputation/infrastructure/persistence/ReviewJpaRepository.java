package org.uce.campusmarket.reputation.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    int countByReviewedUserId(
            UUID reviewedUserId
    );

    @Query("""
            SELECT COALESCE(AVG(r.rating), 0)
            FROM ReviewJpaEntity r
            WHERE r.reviewedUserId = :reviewedUserId
            """)
    Double getAverageRatingByReviewedUserId(
            @Param("reviewedUserId") UUID reviewedUserId
    );
}