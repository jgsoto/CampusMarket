package org.uce.campusmarket.marketplace.domain.service;

import org.uce.campusmarket.marketplace.domain.model.PaymentResult;
import java.util.UUID;

public interface PaymentGateway {
    PaymentResult processPayment(UUID buyerId, Double amount);
}
