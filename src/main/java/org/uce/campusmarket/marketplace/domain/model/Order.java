package org.uce.campusmarket.marketplace.domain.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class Order {
    private UUID id;
    private UUID buyerId;
    private UUID listingId;
    private Double amount;
    private OrderStatus status;
    private String paymentId;
    private LocalDateTime createdAt;

    public Order(UUID id, UUID buyerId, UUID listingId, Double amount) {
        if (buyerId == null || listingId == null || amount == null || amount < 0) {
            throw new DomainException("Datos de la orden inválidos");
        }
        this.id = id != null ? id : UUID.randomUUID();
        this.buyerId = buyerId;
        this.listingId = listingId;
        this.amount = amount;
        this.status = OrderStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public void markAsCompleted(String paymentId) {
        this.status = OrderStatus.COMPLETED;
        this.paymentId = paymentId;
    }

    public void markAsFailed() {
        this.status = OrderStatus.FAILED;
    }
}
