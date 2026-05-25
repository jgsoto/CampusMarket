package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetUserReviewsUseCase {

    private final ReviewRepository reviewRepository;

    public List<ReviewResponse> execute(UUID reviewedUserId) {

        List<Review> reviews =
                reviewRepository.findByReviewedUserId(reviewedUserId);

        return reviews.stream()
                .map(review -> ReviewResponse.builder()
                        .id(review.getId())
                        .reviewerId(review.getReviewerId())
                        .reviewedUserId(review.getReviewedUserId())
                        .targetId(review.getTargetId())
                        .targetType(review.getTargetType().name())
                        .rating(review.getRating())
                        .comment(review.getComment())
                        .createdAt(review.getCreatedAt())
                        .build()
                )
                .toList();
    }
}