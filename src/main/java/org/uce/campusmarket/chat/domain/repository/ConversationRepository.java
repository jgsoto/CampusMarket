package org.uce.campusmarket.chat.domain.repository;

import org.uce.campusmarket.chat.domain.model.Conversation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository {

    Conversation save(Conversation conversation);

    Optional<Conversation> findById(UUID id);

    List<Conversation> findByParticipant(UUID userId);

    Optional<Conversation> findByListingAndBuyer(
            UUID listingId,
            UUID buyerId
    );
}