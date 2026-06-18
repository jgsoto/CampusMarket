package org.uce.campusmarket.chat.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.chat.application.dto.ConversationResponse;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUserConversationsUseCase {

    private final ConversationRepository repository;

    public List<ConversationResponse> execute(
            UUID userId
    ) {

        return repository.findByParticipant(userId)
                .stream()
                .map(c -> new ConversationResponse(
                        c.getId(),
                        c.getListingId(),
                        c.getBuyerId(),
                        c.getSellerId(),
                        c.getCreatedAt()
                ))
                .toList();
    }
}