package org.uce.campusmarket.reputation.interfaces.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.uce.campusmarket.reputation.application.dto.CreateReviewRequest;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.application.usecase.CreateReviewUseCase;
import org.uce.campusmarket.reputation.application.usecase.GetUserReputationUseCase;
import org.uce.campusmarket.reputation.application.usecase.GetUserReviewsUseCase;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final CreateReviewUseCase createReviewUseCase;
    private final GetUserReputationUseCase getUserReputationUseCase;
    private final GetUserReviewsUseCase getUserReviewsUseCase;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestHeader("X-User-Id") UUID reviewerId,
            @RequestBody CreateReviewRequest request
    ) {

        ReviewResponse response =
                createReviewUseCase.execute(reviewerId, request);

        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/users/{userId}/reputation")
    public ResponseEntity<Map<String, Double>> getReputation(
            @PathVariable UUID userId
    ) {

        double reputation =
                getUserReputationUseCase.execute(userId);

        return ResponseEntity.ok(
                Map.of("reputation", reputation)
        );
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(
            @PathVariable UUID userId
    ) {

        List<ReviewResponse> response =
                getUserReviewsUseCase.execute(userId);

        return ResponseEntity.ok(response);
    }
}