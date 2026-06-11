package org.uce.campusmarket.reputation.domain.service;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.shared.exception.DomainException;

@Component
public class ReviewPolicy {

    public void validateAlreadyReviewed(
            boolean alreadyReviewed
    ) {

        if (alreadyReviewed) {

            throw new DomainException(
                    "Ya calificaste este elemento"
            );
        }
    }

    public void validateNotSelfReview(
            UUID reviewerId,
            UUID reviewedUserId
    ) {

        if (reviewerId.equals(reviewedUserId)) {

            throw new DomainException(
                    "No puedes calificarte a ti mismo"
            );
        }
    }
}