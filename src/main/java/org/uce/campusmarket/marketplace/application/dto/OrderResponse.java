package org.uce.campusmarket.marketplace.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        UUID listingId,
        String listingTitle,
        Double amount,
        String status,
        String paymentId,
        LocalDateTime createdAt
) {}
