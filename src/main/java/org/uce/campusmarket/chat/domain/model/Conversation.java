package org.uce.campusmarket.chat.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Conversation {

    private UUID id;

    private UUID listingId;

    private UUID buyerId;

    private UUID sellerId;

    private ConversationStatus status;

    private List<Message> messages;

    private LocalDateTime createdAt;

    public Conversation(
            UUID id,
            UUID listingId,
            UUID buyerId,
            UUID sellerId
    ) {

        validate(
                listingId,
                buyerId,
                sellerId
        );

        this.id = id != null ? id : UUID.randomUUID();
        this.listingId = listingId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.status = ConversationStatus.ACTIVE;
        this.messages = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public static Conversation create(
            UUID listingId,
            UUID buyerId,
            UUID sellerId
    ) {

        return new Conversation(
                UUID.randomUUID(),
                listingId,
                buyerId,
                sellerId
        );
    }

    public Message sendMessage(
            UUID senderId,
            String content
    ) {

        if (status == ConversationStatus.CLOSED) {
            throw new DomainException(
                    "La conversación está cerrada"
            );
        }

        if (!isParticipant(senderId)) {
            throw new DomainException(
                    "No pertenece a esta conversación"
            );
        }

        Message message =
                Message.create(
                        id,
                        senderId,
                        content
                );

        messages.add(message);

        return message;
    }

    public void close(UUID requesterId) {

        if (!isParticipant(requesterId)) {

            throw new DomainException(
                    "No puede cerrar esta conversación"
            );
        }

        this.status = ConversationStatus.CLOSED;
    }

    public boolean isParticipant(UUID userId) {

        return buyerId.equals(userId)
                || sellerId.equals(userId);
    }

    private void validate(
            UUID listingId,
            UUID buyerId,
            UUID sellerId
    ) {

        if (listingId == null) {
            throw new DomainException(
                    "La publicación es obligatoria"
            );
        }

        if (buyerId == null) {
            throw new DomainException(
                    "El comprador es obligatorio"
            );
        }

        if (sellerId == null) {
            throw new DomainException(
                    "El vendedor es obligatorio"
            );
        }

        if (buyerId.equals(sellerId)) {
            throw new DomainException(
                    "No puedes conversar contigo mismo"
            );
        }
    }
}