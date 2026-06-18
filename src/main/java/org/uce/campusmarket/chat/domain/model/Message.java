package org.uce.campusmarket.chat.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Message {

    private UUID id;

    private UUID conversationId;

    private UUID senderId;

    private String content;

    private LocalDateTime createdAt;

    public Message(
            UUID id,
            UUID conversationId,
            UUID senderId,
            String content,
            LocalDateTime createdAt
    ) {

        validate(
                conversationId,
                senderId,
                content
        );

        this.id = id != null ? id : UUID.randomUUID();
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content.trim();
        this.createdAt = createdAt != null
                ? createdAt
                : LocalDateTime.now();
    }

    public static Message create(
            UUID conversationId,
            UUID senderId,
            String content
    ) {

        return new Message(
                UUID.randomUUID(),
                conversationId,
                senderId,
                content,
                LocalDateTime.now()
        );
    }

    private void validate(
            UUID conversationId,
            UUID senderId,
            String content
    ) {

        if (conversationId == null) {
            throw new DomainException(
                    "Conversación obligatoria"
            );
        }

        if (senderId == null) {
            throw new DomainException(
                    "Remitente obligatorio"
            );
        }

        if (content == null || content.isBlank()) {
            throw new DomainException(
                    "El mensaje no puede estar vacío"
            );
        }

        if (content.length() > 1000) {
            throw new DomainException(
                    "Mensaje demasiado largo"
            );
        }
    }
}