package org.uce.campusmarket.chat.infrastructure.mapper;

import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.infrastructure.persistence.ConversationEntity;

public class ConversationMapper {

    private ConversationMapper() {}

    public static ConversationEntity toEntity(
            Conversation conversation
    ) {

        return ConversationEntity.builder()
                .id(conversation.getId())
                .listingId(conversation.getListingId())
                .buyerId(conversation.getBuyerId())
                .sellerId(conversation.getSellerId())
                .createdAt(conversation.getCreatedAt())
                .build();
    }

    public static Conversation toDomain(
            ConversationEntity entity
    ) {

        return new Conversation(
                entity.getId(),
                entity.getListingId(),
                entity.getBuyerId(),
                entity.getSellerId()
        );
    }
}