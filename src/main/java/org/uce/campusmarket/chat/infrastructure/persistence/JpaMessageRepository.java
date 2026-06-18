package org.uce.campusmarket.chat.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaMessageRepository
        extends JpaRepository<MessageEntity, UUID> {

    List<MessageEntity>
    findByConversationIdOrderBySentAtAsc(
            UUID conversationId
    );
}