package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.reputation.application.dto.CreateReviewRequest;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateReviewUseCase {

    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewResponse execute(
            UUID reviewerId,
            CreateReviewRequest request
    ) {

        boolean alreadyReviewed =
                reviewRepository.existsByReviewerIdAndTargetId(
                        reviewerId,
                        request.getTargetId()
                );

        if (alreadyReviewed) {
            throw new DomainException(
                    "Ya calificaste este elemento"
            );
        }

        Review review = new Review(
                null,
                reviewerId,
                request.getReviewedUserId(),
                request.getTargetId(),
                request.getTargetType(),
                request.getRating(),
                request.getComment()
        );

        Review saved =
                reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(saved.getId())
                .reviewerId(saved.getReviewerId())
                .reviewedUserId(saved.getReviewedUserId())
                .targetId(saved.getTargetId())
                .targetType(saved.getTargetType().name())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}