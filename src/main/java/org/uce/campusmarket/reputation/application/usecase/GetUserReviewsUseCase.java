package org.uce.campusmarket.reputation.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.uce.campusmarket.reputation.application.dto.ReviewResponse;
import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetUserReviewsUseCase {

    private final ReviewRepository reviewRepository;

    private final UserRepository userRepository;

    private final TutoringOfferRepository
            tutoringOfferRepository;

    public List<ReviewResponse> execute(
            UUID userId
    ) {

        return reviewRepository
                .findByReviewedUserId(userId)
                .stream()
                .map(review -> {

                    String reviewerName =
                            userRepository
                                    .findById(
                                            review.getReviewerId()
                                    )
                                    .map(
                                            user ->
                                                    user.getFullName()
                                    )
                                    .orElse(
                                            "Usuario"
                                    );

                    String targetTitle =
                            tutoringOfferRepository
                                    .findById(
                                            review.getTargetId()
                                    )
                                    .map(
                                            tutoring ->
                                                    tutoring.getSubject()
                                    )
                                    .orElse(
                                            "Tutoría"
                                    );

                    return ReviewResponse
                            .builder()

                            .id(
                                    review.getId()
                            )

                            .reviewerId(
                                    review.getReviewerId()
                            )

                            .reviewedUserId(
                                    review.getReviewedUserId()
                            )

                            .targetId(
                                    review.getTargetId()
                            )

                            .targetType(
                                    review.getTargetType().name()
                            )

                            .rating(
                                    review.getRating()
                            )

                            .comment(
                                    review.getComment()
                            )

                            .createdAt(
                                    review.getCreatedAt()
                            )

                            .reviewerName(
                                    reviewerName
                            )

                            .targetTitle(
                                    targetTitle
                            )

                            .build();

                })
                .toList();
    }
}