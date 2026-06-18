package org.uce.campusmarket.chat.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponse(

        UUID id,

        UUID senderId,

        String content,

        LocalDateTime sentAt

) {
}