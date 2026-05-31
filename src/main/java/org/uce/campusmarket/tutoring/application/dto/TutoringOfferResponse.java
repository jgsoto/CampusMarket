package org.uce.campusmarket.tutoring.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TutoringOfferResponse {

    private UUID id;

    private UUID tutorId;

    private String subject;

    private String description;

    private Double hourlyRate;

    private String status;

    private LocalDateTime createdAt;

    private String tutorName;

    private String tutorEmail;

    private String tutorPhone;

    private String tutorAddress;

    private String tutorSocialMedia;

    private Double averageRating;

    private Integer totalReviews;
}