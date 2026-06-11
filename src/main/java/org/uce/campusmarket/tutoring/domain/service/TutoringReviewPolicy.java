package org.uce.campusmarket.tutoring.domain.service;

import java.util.UUID;

import org.springframework.stereotype.Component;

import org.uce.campusmarket.shared.exception.DomainException;

import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.model.TutoringStatus;

@Component
public class TutoringReviewPolicy {

    public void validate(
            TutoringOffer tutoring,
            UUID reviewedUserId
    ) {

        if (tutoring.getStatus() != TutoringStatus.CLOSED) {

            throw new DomainException(
                    "Solo puedes reseñar tutorías cerradas"
            );
        }

        if (!tutoring.getTutorId().equals(
                reviewedUserId
        )) {

            throw new DomainException(
                    "El tutor no coincide"
            );
        }
    }
}