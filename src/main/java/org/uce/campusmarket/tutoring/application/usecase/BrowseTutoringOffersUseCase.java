package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;
import org.uce.campusmarket.tutoring.domain.model.TutoringStatus;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrowseTutoringOffersUseCase {

    private final TutoringOfferRepository repository;

    public List<TutoringOfferResponse> execute() {
        return repository.findAll().stream()
                .filter(offer -> offer.getStatus() == TutoringStatus.ACTIVE)
                .map(offer -> new TutoringOfferResponse(
                        offer.getId(),
                        offer.getTutorId(),
                        offer.getSubject(),
                        offer.getDescription(),
                        offer.getHourlyRate().getValue().doubleValue(),
                        offer.getStatus().name(),
                        offer.getCreatedAt(),
                        null, null, null, null, null
                ))
                .collect(Collectors.toList());
    }
}
