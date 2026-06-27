package org.uce.campusmarket.tutoring.application.dto;

import java.util.UUID;

public record EnrolledStudentResponse(
        UUID studentId,
        String fullName,
        String email
) {}