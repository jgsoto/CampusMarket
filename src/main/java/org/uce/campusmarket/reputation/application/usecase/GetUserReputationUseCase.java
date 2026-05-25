package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUserReputationUseCase {

    private final ReviewRepository reviewRepository;

    public double execute(UUID userId) {

        List<Review> reviews =
                reviewRepository.findByReviewedUserId(userId);

        if (reviews.isEmpty()) {
            return 0.0;
        }

        double average =
                reviews.stream()
                        .mapToInt(Review::getRating)
                        .average()
                        .orElse(0.0);

        return Math.round(average * 10.0) / 10.0;
    }
}