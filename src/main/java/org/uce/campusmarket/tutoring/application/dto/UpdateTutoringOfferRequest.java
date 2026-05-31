package org.uce.campusmarket.tutoring.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTutoringOfferRequest {
    private UUID tutorId;
    private String subject;
    private String description;
    private Double hourlyRate;
}
