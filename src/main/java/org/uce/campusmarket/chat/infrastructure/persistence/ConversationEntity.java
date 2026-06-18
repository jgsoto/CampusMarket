package org.uce.campusmarket.chat.infrastructure.persistence;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationEntity {

    @Id
    private UUID id;

    private UUID listingId;

    private UUID buyerId;

    private UUID sellerId;

    private LocalDateTime createdAt;
}