package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloseConversationUseCase {

    private final ConversationRepository repository;

    public void execute(
            UUID conversationId,
            UUID requesterId
    ) {

        Conversation conversation =
                repository.findById(conversationId)
                        .orElseThrow();

        conversation.close(
                requesterId
        );

        repository.save(
                conversation
        );
    }
}