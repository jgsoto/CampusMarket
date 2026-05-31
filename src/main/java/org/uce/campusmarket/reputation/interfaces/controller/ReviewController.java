package org.uce.campusmarket.reputation.interfaces.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.uce.campusmarket.reputation.application.dto.CreateReviewRequest;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.application.usecase.*;

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
    private final UpdateReviewUseCase updateReviewUseCase;

    private final DeleteReviewUseCase
            deleteReviewUseCase;

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

    @PutMapping("/{reviewId}")
    public ResponseEntity<Void> updateReview(

            @PathVariable
            UUID reviewId,

            @RequestHeader(
                    "X-User-Id"
            )
            UUID userId,

            @RequestBody
            Map<String,Object> body
    ){

        updateReviewUseCase.execute(

                reviewId,

                userId,

                (Integer) body.get(
                        "rating"
                ),

                body.get(
                        "comment"
                ).toString()
        );

        return ResponseEntity.ok()
                .build();
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(

            @PathVariable
            UUID reviewId,

            @RequestHeader(
                    "X-User-Id"
            )
            UUID userId
    ){

        deleteReviewUseCase.execute(
                reviewId,
                userId
        );

        return ResponseEntity.ok()
                .build();
    }
}