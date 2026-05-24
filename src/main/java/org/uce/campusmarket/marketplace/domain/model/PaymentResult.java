package org.uce.campusmarket.marketplace.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResult {
    private boolean success;
    private String transactionId;
    private String errorMessage;
}
