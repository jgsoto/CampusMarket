package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.chat.application.dto.MessageResponse;
import org.uce.campusmarket.chat.domain.repository.MessageRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetConversationMessagesUseCase {

    private final MessageRepository repository;

    public List<MessageResponse> execute(
            UUID conversationId
    ) {

        return repository
                .findByConversation(conversationId)
                .stream()
                .map(message ->
                        new MessageResponse(
                                message.getId(),
                                message.getSenderId(),
                                message.getContent(),
                                message.getCreatedAt()
                        )
                )
                .toList();
    }
}