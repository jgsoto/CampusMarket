package org.uce.campusmarket.reputation.domain.model;

import lombok.Getter;
import lombok.Setter;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class Review {

    private UUID id;

    private UUID reviewerId;

    private UUID reviewedUserId;

    private UUID targetId;

    private ReviewTargetType targetType;

    private int rating;

    private String comment;

    private LocalDateTime createdAt;

    public Review(
            UUID id,
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            int rating,
            String comment
    ) {

        validate(
                reviewerId,
                reviewedUserId,
                targetId,
                rating
        );

        this.id = id != null ? id : UUID.randomUUID();

        this.reviewerId = reviewerId;

        this.reviewedUserId = reviewedUserId;

        this.targetId = targetId;

        this.targetType = targetType;

        this.rating = rating;

        this.comment = comment;

        this.createdAt = LocalDateTime.now();
    }

    public Review(
            UUID id,
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            int rating,
            String comment,
            LocalDateTime createdAt
    ) {

        validate(
                reviewerId,
                reviewedUserId,
                targetId,
                rating
        );

        this.id = id != null ? id : UUID.randomUUID();

        this.reviewerId = reviewerId;

        this.reviewedUserId = reviewedUserId;

        this.targetId = targetId;

        this.targetType = targetType;

        this.rating = rating;

        this.comment = comment;

        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public void update(
            int rating,
            String comment
    ) {
        validate(
                this.reviewerId,
                this.reviewedUserId,
                this.targetId,
                rating
        );

        this.rating = rating;
        this.comment = comment;
    }

    private void validate(
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            int rating
    ) {

        if (reviewerId == null) {
            throw new DomainException(
                    "El reviewer es obligatorio"
            );
        }

        if (reviewedUserId == null) {
            throw new DomainException(
                    "El usuario evaluado es obligatorio"
            );
        }

        if (targetId == null) {
            throw new DomainException(
                    "El target es obligatorio"
            );
        }

        if (reviewerId.equals(reviewedUserId)) {
            throw new DomainException(
                    "No puedes evaluarte a ti mismo"
            );
        }

        if (rating < 1 || rating > 5) {
            throw new DomainException(
                    "La calificación debe estar entre 1 y 5"
            );
        }
    }
}