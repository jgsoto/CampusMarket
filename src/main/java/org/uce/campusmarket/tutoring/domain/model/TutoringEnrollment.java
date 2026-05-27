package org.uce.campusmarket.tutoring.domain.model;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutoringEnrollment {

    private UUID id;

    private UUID tutoringOfferId;

    private UUID studentId;
}