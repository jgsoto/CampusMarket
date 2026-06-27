package org.uce.campusmarket.identity.application.dto;

import java.util.UUID;

public record BasicUserResponse(
        UUID id,
        String fullName,
        String email
) {}