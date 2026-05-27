package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateReviewUseCase {

    private final ReviewRepository
            reviewRepository;

    public void execute(
            UUID reviewId,
            UUID requesterId,
            int rating,
            String comment
    ){

        Review review =
                reviewRepository
                        .findById(reviewId)
                        .orElseThrow(() ->
                                new DomainException(
                                        "Reseña no encontrada"
                                )
                        );

        if(
                !review.getReviewerId()
                        .equals(requesterId)
        ){

            throw new DomainException(
                    "No puedes editar esta reseña"
            );
        }

        review.setRating(
                rating
        );

        review.setComment(
                comment
        );

        reviewRepository.save(
                review
        );
    }
}