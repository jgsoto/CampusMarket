package org.uce.campusmarket.reputation.application.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateReviewRequest {

    private UUID reviewedUserId;

    private UUID targetId;

    private int rating;

    private String comment;
}