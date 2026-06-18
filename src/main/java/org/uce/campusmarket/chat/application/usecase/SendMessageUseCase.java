package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.chat.application.dto.MessageResponse;
import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.domain.model.Message;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;
import org.uce.campusmarket.chat.domain.repository.MessageRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SendMessageUseCase {

    private final ConversationRepository conversationRepository;

    private final MessageRepository messageRepository;

    public MessageResponse execute(
            UUID conversationId,
            UUID senderId,
            String content
    ) {

        Conversation conversation =
                conversationRepository
                        .findById(conversationId)
                        .orElseThrow();

        Message message =
                Message.create(
                        conversationId,
                        senderId,
                        content
                );

        messageRepository.save(message);

        return new MessageResponse(
                message.getId(),
                message.getSenderId(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}