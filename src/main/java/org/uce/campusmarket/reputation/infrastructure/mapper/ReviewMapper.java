package org.uce.campusmarket.reputation.infrastructure.mapper;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.infrastructure.persistence.ReviewJpaEntity;

@Component
public class ReviewMapper {

    public ReviewJpaEntity toEntity(Review review) {

        return ReviewJpaEntity.builder()
                .id(review.getId())
                .reviewerId(review.getReviewerId())
                .reviewedUserId(review.getReviewedUserId())
                .targetId(review.getTargetId())
                .targetType(review.getTargetType())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public Review toDomain(ReviewJpaEntity entity) {

        return new Review(
                entity.getId(),
                entity.getReviewerId(),
                entity.getReviewedUserId(),
                entity.getTargetId(),
                entity.getTargetType(),
                entity.getRating(),
                entity.getComment()
        );
    }
}