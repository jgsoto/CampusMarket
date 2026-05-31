package org.uce.campusmarket.reputation.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class ReviewResponse {

    private UUID id;

    private UUID reviewerId;

    private UUID reviewedUserId;

    private UUID targetId;

    private String targetType;

    private int rating;

    private String comment;

    private LocalDateTime createdAt;

    private String reviewerName;

    private String targetTitle;
}