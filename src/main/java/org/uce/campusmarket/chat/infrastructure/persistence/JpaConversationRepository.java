package org.uce.campusmarket.chat.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JpaConversationRepository
        extends JpaRepository<ConversationEntity, UUID> {

    List<ConversationEntity>
    findByBuyerIdOrSellerId(
            UUID buyerId,
            UUID sellerId
    );

    Optional<ConversationEntity>
    findByListingIdAndBuyerId(
            UUID listingId,
            UUID buyerId
    );
}