package org.uce.campusmarket.chat.application.dto;

import java.util.UUID;

public record CreateConversationRequest(

        UUID listingId,

        UUID sellerId

) {
}