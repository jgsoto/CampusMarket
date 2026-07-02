package org.uce.campusmarket.identity.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String fullName,
        String email,
        Double trustScore,
        String phone,
        String address,
        String description,
        String socialMedia,
        String photoUrl,
        LocalDateTime createdAt
) {}
