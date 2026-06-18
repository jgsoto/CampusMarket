package org.uce.campusmarket.chat.infrastructure.persistence;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;

import org.uce.campusmarket.chat.domain.model.Conversation;
import org.uce.campusmarket.chat.domain.repository.ConversationRepository;
import org.uce.campusmarket.chat.infrastructure.mapper.ConversationMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ConversationRepositoryImpl
        implements ConversationRepository {

    private final JpaConversationRepository repository;

    @Override
    public Conversation save(
            Conversation conversation
    ) {

        return ConversationMapper.toDomain(
                repository.save(
                        ConversationMapper.toEntity(conversation)
                )
        );
    }

    @Override
    public Optional<Conversation> findById(
            UUID id
    ) {

        return repository.findById(id)
                .map(ConversationMapper::toDomain);
    }

    @Override
    public List<Conversation> findByParticipant(
            UUID userId
    ) {

        return repository
                .findByBuyerIdOrSellerId(
                        userId,
                        userId
                )
                .stream()
                .map(ConversationMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Conversation> findByListingAndBuyer(
            UUID listingId,
            UUID buyerId
    ) {

        return repository
                .findByListingIdAndBuyerId(
                        listingId,
                        buyerId
                )
                .map(ConversationMapper::toDomain);
    }
}