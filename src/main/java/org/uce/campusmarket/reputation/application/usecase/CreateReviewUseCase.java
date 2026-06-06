package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import org.uce.campusmarket.reputation.application.dto.CreateReviewRequest;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.model.ReviewTargetType;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.reputation.domain.valueobject.Rating;
import org.uce.campusmarket.shared.exception.DomainException;

import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.model.TutoringStatus;

import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateReviewUseCase {

    private final ReviewRepository reviewRepository;

    private final ListingRepository listingRepository;

    private final TutoringOfferRepository tutoringOfferRepository;

    private final TutoringEnrollmentRepository tutoringEnrollmentRepository;

    public ReviewResponse execute(UUID reviewerId, CreateReviewRequest request) {

        boolean alreadyReviewed = reviewRepository.existsByReviewerIdAndTargetId(reviewerId, request.getTargetId());

        Rating rating = new Rating(
                request.getRating()
        );

        if (alreadyReviewed) {

            throw new DomainException("Ya calificaste esta tutoría");
        }

        if (request.getTargetType() == ReviewTargetType.MARKETPLACE) {

            Listing listing = listingRepository.findById(request.getTargetId()).orElseThrow(() -> new DomainException("La publicación no existe"));

            if (listing.getStatus() != ListingStatus.VENDIDO) {

                throw new DomainException("Solo puedes reseñar productos vendidos");
            }

            if (!listing.getOwnerId().equals(request.getReviewedUserId())) {

                throw new DomainException("El usuario reseñado no coincide");
            }
        }

        if (request.getTargetType() == ReviewTargetType.TUTORING) {

            TutoringOffer tutoring = tutoringOfferRepository.findById(request.getTargetId()).orElseThrow(() -> new DomainException("La tutoría no existe"));

            if (tutoring.getStatus() != TutoringStatus.CLOSED) {

                throw new DomainException("Solo puedes reseñar tutorías cerradas");
            }

            tutoringEnrollmentRepository.findByTutoringOfferIdAndStudentId(tutoring.getId(), reviewerId).orElseThrow(() -> new DomainException("No estás inscrito en esta tutoría"));

            if (!tutoring.getTutorId().equals(request.getReviewedUserId())) {

                throw new DomainException("El tutor no coincide");
            }
        }

        Review review = Review.create(reviewerId, request.getReviewedUserId(), request.getTargetId(), request.getTargetType(), rating, request.getComment());

        Review saved = reviewRepository.save(review);

        return ReviewResponse.builder().id(saved.getId()).reviewerId(saved.getReviewerId()).reviewedUserId(saved.getReviewedUserId()).targetId(saved.getTargetId()).targetType(saved.getTargetType().name()).rating(saved.getRating()).comment(saved.getComment()).createdAt(saved.getCreatedAt()).build();
    }
}