package org.uce.campusmarket.chat.infrastructure.mapper;

import org.uce.campusmarket.chat.domain.model.Message;
import org.uce.campusmarket.chat.infrastructure.persistence.MessageEntity;

public class MessageMapper {

    private MessageMapper() {}

    public static MessageEntity toEntity(
            Message message
    ) {

        return MessageEntity.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .sentAt(message.getCreatedAt())
                .build();
    }

    public static Message toDomain(
            MessageEntity entity
    ) {

        return new Message(
                entity.getId(),
                entity.getConversationId(),
                entity.getSenderId(),
                entity.getContent(),
                entity.getSentAt()
        );
    }
}