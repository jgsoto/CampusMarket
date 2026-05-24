package org.uce.campusmarket.marketplace.domain.repository;

import org.uce.campusmarket.marketplace.domain.model.Order;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID id);
    List<Order> findByBuyerId(UUID buyerId);
}
