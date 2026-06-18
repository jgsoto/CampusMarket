package org.uce.campusmarket.chat.infrastructure.persistence;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageEntity {

    @Id
    private UUID id;

    private UUID conversationId;

    private UUID senderId;

    @Column(length = 1000)
    private String content;

    private LocalDateTime sentAt;
}