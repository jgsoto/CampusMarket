package org.uce.campusmarket.reputation.application.dto;

import lombok.Getter;
import lombok.Setter;

import org.uce.campusmarket.reputation.domain.model.ReviewTargetType;
import org.uce.campusmarket.reputation.domain.valueobject.Rating;

import java.util.UUID;

@Getter
@Setter
public class CreateReviewRequest {

    private UUID reviewedUserId;

    private UUID targetId;

    private ReviewTargetType targetType;

    private int rating;

    private String comment;
}