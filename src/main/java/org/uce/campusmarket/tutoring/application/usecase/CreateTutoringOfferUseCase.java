package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.tutoring.application.dto.CreateTutoringOfferRequest;
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
public class CreateTutoringOfferUseCase {

    private final TutoringOfferRepository repository;
    private final UserRepository userRepository;

    public TutoringOfferResponse execute(CreateTutoringOfferRequest request) {

        User tutor = userRepository.findById(request.getTutorId())
                .orElseThrow(() -> new DomainException("El tutor no existe"));

        if (tutor == null) {
            throw new DomainException("Tutor inválido");
        }

        if (request.getHourlyRate() == null || request.getHourlyRate() <= 0) {
            throw new DomainException("La tarifa por hora debe ser mayor a 0");
        }

        TutoringOffer offer = TutoringOffer.builder()
                .id(UUID.randomUUID())
                .tutorId(request.getTutorId())
                .subject(request.getSubject())
                .description(request.getDescription())
                .hourlyRate(new HourlyRate(request.getHourlyRate()))
                .build();

        TutoringOffer savedOffer = repository.save(offer);

        return new TutoringOfferResponse(
                savedOffer.getId(),
                savedOffer.getTutorId(),
                savedOffer.getSubject(),
                savedOffer.getDescription(),
                savedOffer.getHourlyRate().getValue().doubleValue(),
                savedOffer.getStatus().name(),
                savedOffer.getCreatedAt(),

                tutor.getFullName(),
                tutor.getEmail(),
                tutor.getPhone(),
                tutor.getAddress(),
                tutor.getSocialMedia(),

                null,
                null);
    }
}