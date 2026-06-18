package org.uce.campusmarket.chat.domain.service;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Component
public class ChatPolicy {

    public void validateConversationCreation(
            UUID buyerId,
            UUID sellerId
    ) {

        if (buyerId.equals(sellerId)) {

            throw new DomainException(
                    "No puedes iniciar un chat contigo mismo"
            );
        }
    }
}