package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetConversationUseCase {

    private final ConversationRepository repository;

    public Conversation execute(
            UUID conversationId
    ) {

        return repository.findById(
                conversationId
        ).orElseThrow();
    }
}