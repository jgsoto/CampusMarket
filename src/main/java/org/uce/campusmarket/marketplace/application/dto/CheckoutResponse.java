package org.uce.campusmarket.marketplace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class CheckoutResponse {
    private boolean success;
    private String transactionId;
    private String message;
    private UUID orderId;
}
