package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.shared.exception.DomainException;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteTutoringOfferUseCase {

    private final TutoringOfferRepository repository;

    public void execute(UUID offerId, UUID requesterId) {
        TutoringOffer offer = repository.findById(offerId)
                .orElseThrow(() -> new DomainException("La oferta de tutoría no existe"));

        if (!offer.getTutorId().equals(requesterId)) {
            throw new DomainException("Solo el creador puede eliminar esta tutoría");
        }

        repository.deleteById(offerId);
    }
}