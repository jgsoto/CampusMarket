package org.uce.campusmarket.reputation.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.reputation.domain.valueobject.Rating;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review {

    private UUID id;

    private UUID reviewerId;

    private UUID reviewedUserId;

    private UUID targetId;

    private ReviewTargetType targetType;

    private Rating rating;

    private String comment;

    private LocalDateTime createdAt;

    public Review(
            UUID id,
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            Rating rating,
            String comment
    ) {
        this(
                id,
                reviewerId,
                reviewedUserId,
                targetId,
                targetType,
                rating,
                comment,
                LocalDateTime.now()
        );
    }

    public Review(
            UUID id,
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            Rating rating,
            String comment,
            LocalDateTime createdAt
    ) {
        validate(
                reviewerId,
                reviewedUserId,
                targetId,
                targetType,
                rating
        );

        this.id = id != null ? id : UUID.randomUUID();
        this.reviewerId = reviewerId;
        this.reviewedUserId = reviewedUserId;
        this.targetId = targetId;
        this.targetType = targetType;
        this.rating = rating;
        this.comment = normalizeComment(comment);
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    public static Review create(
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            Rating rating,
            String comment
    ) {

        if (reviewerId.equals(reviewedUserId)) {

            throw new DomainException(
                    "No puedes calificarte a ti mismo"
            );
        }


        return new Review(
                UUID.randomUUID(),
                reviewerId,
                reviewedUserId,
                targetId,
                targetType,
                rating,
                comment
        );
    }

    public void update(
            Rating rating,
            String comment
    ) {
        validate(
                this.reviewerId,
                this.reviewedUserId,
                this.targetId,
                this.targetType,
                rating
        );

        this.rating = rating;
        this.comment = normalizeComment(comment);
    }

    private void validate(
            UUID reviewerId,
            UUID reviewedUserId,
            UUID targetId,
            ReviewTargetType targetType,
            Rating rating
    ) {
        if (reviewerId == null) {
            throw new DomainException("El reviewer es obligatorio");
        }

        if (reviewedUserId == null) {
            throw new DomainException("El usuario evaluado es obligatorio");
        }

        if (targetId == null) {
            throw new DomainException("El target es obligatorio");
        }

        if (targetType == null) {
            throw new DomainException("El tipo de target es obligatorio");
        }

        if (reviewerId.equals(reviewedUserId)) {
            throw new DomainException("No puedes evaluarte a ti mismo");
        }
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.isBlank()) {
            throw new DomainException("El comentario es obligatorio");
        }

        String normalizedComment = comment.trim();

        if (normalizedComment.length() > 500) {
            throw new DomainException("El comentario no puede superar los 500 caracteres");
        }

        return normalizedComment;
    }

    public int getRating() {
        return rating.getValue();
    }
}