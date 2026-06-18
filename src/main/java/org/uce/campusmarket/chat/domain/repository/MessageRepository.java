package org.uce.campusmarket.chat.domain.repository;

import org.uce.campusmarket.chat.domain.model.Message;

import java.util.List;
import java.util.UUID;

public interface MessageRepository {

    Message save(Message message);

    List<Message> findByConversation(
            UUID conversationId
    );
}