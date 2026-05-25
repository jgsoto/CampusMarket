package org.uce.campusmarket.identity.application.dto;

public record UserProfileRequest(
        String phone,
        String address,
        String description,
        String socialMedia
) {}
