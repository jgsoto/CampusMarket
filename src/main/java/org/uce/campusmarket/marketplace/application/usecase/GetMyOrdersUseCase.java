package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.OrderResponse;
import org.uce.campusmarket.marketplace.domain.model.Order;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.repository.OrderRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetMyOrdersUseCase {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;

    public List<OrderResponse> execute(UUID buyerId) {
        List<Order> orders = orderRepository.findByBuyerId(buyerId);

        return orders.stream()
                .filter(o -> o.getStatus().name().equals("COMPLETED"))
                .map(order -> {
                    String listingTitle = listingRepository.findById(order.getListingId())
                            .map(l -> l.getTitle().getValue())
                            .orElse("Producto eliminado");

                    return new OrderResponse(
                            order.getId(),
                            order.getListingId(),
                            listingTitle,
                            order.getAmount(),
                            order.getStatus().name(),
                            order.getPaymentId(),
                            order.getCreatedAt()
                    );
                })
                .toList();
    }
}
