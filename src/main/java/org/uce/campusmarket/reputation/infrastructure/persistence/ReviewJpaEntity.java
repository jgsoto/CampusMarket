package org.uce.campusmarket.reputation.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID reviewerId;

    @Column(nullable = false)
    private UUID reviewedUserId;

    @Column(nullable = false)
    private UUID targetId;

    @Column(nullable = false)
    private int rating;

    @Column(length = 500)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}