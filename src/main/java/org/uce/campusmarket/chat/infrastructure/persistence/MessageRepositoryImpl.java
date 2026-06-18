package org.uce.campusmarket.chat.infrastructure.persistence;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;

import org.uce.campusmarket.chat.domain.model.Message;
import org.uce.campusmarket.chat.domain.repository.MessageRepository;
import org.uce.campusmarket.chat.infrastructure.mapper.MessageMapper;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class MessageRepositoryImpl
        implements MessageRepository {

    private final JpaMessageRepository repository;

    @Override
    public Message save(
            Message message
    ) {

        return MessageMapper.toDomain(
                repository.save(
                        MessageMapper.toEntity(message)
                )
        );
    }

    @Override
    public List<Message> findByConversation(
            UUID conversationId
    ) {

        return repository
                .findByConversationIdOrderBySentAtAsc(
                        conversationId
                )
                .stream()
                .map(MessageMapper::toDomain)
                .toList();
    }
}