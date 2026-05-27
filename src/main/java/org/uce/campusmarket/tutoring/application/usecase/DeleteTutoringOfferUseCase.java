package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteTutoringOfferUseCase {

    private final TutoringOfferRepository repository;

    public void execute(UUID offerId, UUID requesterId) {
        TutoringOffer offer = repository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Tutoring offer not found"));

        if (!offer.getTutorId().equals(requesterId)) {
            throw new IllegalArgumentException("Only the creator can delete this tutoring offer");
        }

        repository.deleteById(offerId);
    }
}
