package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.tutoring.application.dto.CreateTutoringOfferRequest;
import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateTutoringOfferUseCase {

    private final TutoringOfferRepository repository;

    public TutoringOfferResponse execute(CreateTutoringOfferRequest request) {
        TutoringOffer offer = new TutoringOffer(
                UUID.randomUUID(),
                request.getTutorId(),
                request.getSubject(),
                request.getDescription(),
                new HourlyRate(request.getHourlyRate())
        );

        TutoringOffer savedOffer = repository.save(offer);

        return new TutoringOfferResponse(
                savedOffer.getId(),
                savedOffer.getTutorId(),
                savedOffer.getSubject(),
                savedOffer.getDescription(),
                savedOffer.getHourlyRate().getValue().doubleValue(),
                savedOffer.getStatus().name(),
                savedOffer.getCreatedAt(),
                null, null, null, null, null
        );
    }
}
