package org.uce.campusmarket.marketplace.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID buyerId;

    @Column(nullable = false)
    private UUID listingId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private org.uce.campusmarket.marketplace.domain.model.OrderStatus status;

    private String paymentId;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
