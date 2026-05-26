package org.uce.campusmarket.reputation.domain.repository;

import org.uce.campusmarket.reputation.domain.model.Review;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository {

    Review save(Review review);

    Optional<Review> findById(UUID id);

    List<Review> findByReviewedUserId(UUID reviewedUserId);

    boolean existsByReviewerIdAndTargetId(
            UUID reviewerId,
            UUID targetId
    );

    double getAverageRatingByReviewedUserId(UUID reviewedUserId);

    int countByReviewedUserId(UUID reviewedUserId);

    void deleteById(UUID id);
}