package org.uce.campusmarket.marketplace.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Order;
import org.uce.campusmarket.marketplace.domain.repository.OrderRepository;
import org.uce.campusmarket.marketplace.infrastructure.mapper.OrderMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {

    private final JpaOrderRepository jpaOrderRepository;
    private final OrderMapper orderMapper;

    @Override
    public Order save(Order order) {
        OrderJpaEntity entity = orderMapper.toEntity(order);
        return orderMapper.toDomain(jpaOrderRepository.save(entity));
    }

    @Override
    public Optional<Order> findById(UUID id) {
        return jpaOrderRepository.findById(id).map(orderMapper::toDomain);
    }

    @Override
    public List<Order> findByBuyerId(UUID buyerId) {
        return jpaOrderRepository.findByBuyerId(buyerId)
                .stream()
                .map(orderMapper::toDomain)
                .toList();
    }
}
