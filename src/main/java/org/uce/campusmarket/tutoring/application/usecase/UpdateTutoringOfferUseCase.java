package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.tutoring.application.dto.UpdateTutoringOfferRequest;
import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateTutoringOfferUseCase {

    private final TutoringOfferRepository repository;
    private final UserRepository userRepository;

    public TutoringOfferResponse execute(UUID offerId, UpdateTutoringOfferRequest request, UUID requesterId) {
        TutoringOffer offer = repository.findById(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Tutoring offer not found"));

        if (!offer.getTutorId().equals(requesterId)) {
            throw new IllegalArgumentException("Only the creator can edit this tutoring offer");
        }

        if (request.getSubject() != null && !request.getSubject().trim().isEmpty()) {
            offer.setSubject(request.getSubject());
        }

        if (request.getDescription() != null && !request.getDescription().trim().isEmpty()) {
            offer.setDescription(request.getDescription());
        }

        if (request.getHourlyRate() != null) {
            offer.setHourlyRate(new HourlyRate(request.getHourlyRate()));
        }

        TutoringOffer updatedOffer = repository.save(offer);

        User tutor = userRepository.findById(updatedOffer.getTutorId())
                .orElseThrow(() -> new DomainException("El tutor no existe"));

        return new TutoringOfferResponse(
                updatedOffer.getId(),
                updatedOffer.getTutorId(),
                updatedOffer.getSubject(),
                updatedOffer.getDescription(),
                updatedOffer.getHourlyRate().getValue().doubleValue(),
                updatedOffer.getStatus().name(),
                updatedOffer.getCreatedAt(),
                
                tutor.getFullName(),
                tutor.getEmail(),
                tutor.getPhone(),
                tutor.getAddress(),
                tutor.getSocialMedia(),
                
                null, 
                null
        );
    }
}
