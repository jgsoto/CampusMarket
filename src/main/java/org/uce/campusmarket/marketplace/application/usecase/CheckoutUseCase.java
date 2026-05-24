package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.CheckoutResponse;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;
import org.uce.campusmarket.marketplace.domain.model.Order;
import org.uce.campusmarket.marketplace.domain.model.PaymentResult;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.repository.OrderRepository;
import org.uce.campusmarket.marketplace.domain.service.PaymentGateway;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
public class CheckoutUseCase {

    private final ListingRepository listingRepository;
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;

    public CheckoutUseCase(ListingRepository listingRepository, OrderRepository orderRepository, PaymentGateway paymentGateway) {
        this.listingRepository = listingRepository;
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    @Transactional
    public CheckoutResponse execute(UUID listingId, UUID buyerId) {
        // 1. Buscar la publicación
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

        // 2. Validar que se pueda comprar antes de contactar pasarelas
        if (listing.getStatus() != ListingStatus.PUBLICADA) {
            throw new DomainException("El producto ya no está disponible para su compra");
        }
        if (listing.getOwnerId().equals(buyerId)) {
            throw new DomainException("No puedes comprar tu propio producto");
        }

        // 3. Registrar la orden en estado PENDING
        Order order = new Order(null, buyerId, listingId, listing.getPrice().getValue().doubleValue());
        order = orderRepository.save(order);

        // 4. Simular la pasarela de pagos
        PaymentResult paymentResult = paymentGateway.processPayment(buyerId, order.getAmount());

        // 5. Procesar resultado
        if (paymentResult.isSuccess()) {
            // Actualizar estado de la publicación usando Optimistic Locking
            listing.markAsSold(buyerId);
            listingRepository.save(listing);

            // Actualizar la orden a COMPLETED
            order.markAsCompleted(paymentResult.getTransactionId());
            orderRepository.save(order);

            return new CheckoutResponse(true, paymentResult.getTransactionId(), "Compra exitosa", order.getId());
        } else {
            // Actualizar la orden a FAILED
            order.markAsFailed();
            orderRepository.save(order);
            
            // Retornamos el DTO de fallo para que no haga rollback de la orden
            return new CheckoutResponse(false, null, paymentResult.getErrorMessage(), order.getId());
        }
    }
}
