package org.uce.campusmarket.marketplace.infrastructure.mapper;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Order;
import org.uce.campusmarket.marketplace.infrastructure.persistence.OrderJpaEntity;

@Component
public class OrderMapper {
    public OrderJpaEntity toEntity(Order domain) {
        if (domain == null) return null;
        return OrderJpaEntity.builder()
                .id(domain.getId())
                .buyerId(domain.getBuyerId())
                .listingId(domain.getListingId())
                .amount(domain.getAmount())
                .status(domain.getStatus())
                .paymentId(domain.getPaymentId())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public Order toDomain(OrderJpaEntity entity) {
        if (entity == null) return null;
        Order order = new Order();
        order.setId(entity.getId());
        order.setBuyerId(entity.getBuyerId());
        order.setListingId(entity.getListingId());
        order.setAmount(entity.getAmount());
        order.setStatus(entity.getStatus());
        order.setPaymentId(entity.getPaymentId());
        order.setCreatedAt(entity.getCreatedAt());
        return order;
    }
}
