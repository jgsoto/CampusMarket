package org.uce.campusmarket.marketplace.infrastructure.payment;

import org.springframework.stereotype.Service;
import org.uce.campusmarket.marketplace.domain.model.PaymentResult;
import org.uce.campusmarket.marketplace.domain.service.PaymentGateway;

import java.util.UUID;
import java.util.Random;

@Service
public class SimulatedPaymentGatewayImpl implements PaymentGateway {

    private final Random random = new Random();

    @Override
    public PaymentResult processPayment(UUID buyerId, Double amount) {
        try {
            // Simulamos el tiempo de espera de una pasarela real (2 a 3 segundos)
            Thread.sleep(2000 + new Random().nextInt(1000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new PaymentResult(false, null, "Error interno en la simulación de pago");
        }

        // El pago siempre es exitoso en la simulación
        // (El frontend controla si mostrar error o éxito según la tarjeta ingresada)
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new PaymentResult(true, transactionId, null);
    }
}
