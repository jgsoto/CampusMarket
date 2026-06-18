package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.uce.campusmarket.chat.application.dto.*;
import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;
import org.uce.campusmarket.chat.domain.service.ChatPolicy;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateConversationUseCase {

    private final ConversationRepository repository;

    private final ChatPolicy policy;

    public ConversationResponse execute(
            UUID buyerId,
            CreateConversationRequest request
    ) {

        policy.validateConversationCreation(
                buyerId,
                request.sellerId()
        );

        Optional<Conversation> existing =
                repository.findByListingAndBuyer(
                        request.listingId(),
                        buyerId
                );

        if (existing.isPresent()) {
            return map(existing.get());
        }

        Conversation conversation =
                Conversation.create(
                        request.listingId(),
                        buyerId,
                        request.sellerId()
                );

        repository.save(conversation);

        return map(conversation);
    }

    private ConversationResponse map(
            Conversation conversation
    ) {
        return new ConversationResponse(
                conversation.getId(),
                conversation.getListingId(),
                conversation.getBuyerId(),
                conversation.getSellerId(),
                conversation.getCreatedAt()
        );
    }
}