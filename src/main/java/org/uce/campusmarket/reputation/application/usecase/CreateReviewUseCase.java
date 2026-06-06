package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.reputation.application.dto.CreateReviewRequest;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;

import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;
import org.uce.campusmarket.reputation.domain.service.ReviewPolicy;
import org.uce.campusmarket.reputation.domain.valueobject.Rating;

import org.uce.campusmarket.shared.exception.DomainException;

import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;
import org.uce.campusmarket.tutoring.domain.service.TutoringReviewPolicy;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateReviewUseCase {

    private final ReviewRepository reviewRepository;

    private final TutoringOfferRepository tutoringOfferRepository;

    private final TutoringEnrollmentRepository tutoringEnrollmentRepository;

    private final ReviewPolicy reviewPolicy;

    private final TutoringReviewPolicy tutoringReviewPolicy;

    public ReviewResponse execute(
            UUID reviewerId,
            CreateReviewRequest request
    ) {

        reviewPolicy.validateNotSelfReview(
                reviewerId,
                request.getReviewedUserId()
        );

        reviewPolicy.validateAlreadyReviewed(
                reviewRepository.existsByReviewerIdAndTargetId(
                        reviewerId,
                        request.getTargetId()
                )
        );

        TutoringOffer tutoring =
                tutoringOfferRepository
                        .findById(request.getTargetId())
                        .orElseThrow(() ->
                                new DomainException(
                                        "La tutoría no existe"
                                )
                        );

        tutoringEnrollmentRepository
                .findByTutoringOfferIdAndStudentId(
                        tutoring.getId(),
                        reviewerId
                )
                .orElseThrow(() ->
                        new DomainException(
                                "No estás inscrito en esta tutoría"
                        )
                );

        tutoringReviewPolicy.validate(
                tutoring,
                request.getReviewedUserId()
        );

        Rating rating = new Rating(
                request.getRating()
        );

        Review review = Review.create(
                reviewerId,
                request.getReviewedUserId(),
                request.getTargetId(),
                rating,
                request.getComment()
        );

        Review saved = reviewRepository.save(review);

        return ReviewResponse.builder()
                .id(saved.getId())
                .reviewerId(saved.getReviewerId())
                .reviewedUserId(saved.getReviewedUserId())
                .targetId(saved.getTargetId())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }
}