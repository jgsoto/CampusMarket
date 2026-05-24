package org.uce.campusmarket.marketplace.interfaces.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.marketplace.application.dto.OrderResponse;
import org.uce.campusmarket.marketplace.application.usecase.GetMyOrdersUseCase;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final GetMyOrdersUseCase getMyOrdersUseCase;

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-User-Id") UUID buyerId
    ) {
        List<OrderResponse> orders = getMyOrdersUseCase.execute(buyerId);
        return ResponseEntity.ok(orders);
    }
}
