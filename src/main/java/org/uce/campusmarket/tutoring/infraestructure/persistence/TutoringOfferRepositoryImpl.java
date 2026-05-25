package org.uce.campusmarket.tutoring.infraestructure.persistence;

import org.springframework.stereotype.Repository;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.model.TutoringStatus;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class TutoringOfferRepositoryImpl implements TutoringOfferRepository {

    private final JpaTutoringOfferRepository jpaRepository;

    public TutoringOfferRepositoryImpl(JpaTutoringOfferRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public TutoringOffer save(TutoringOffer tutoringOffer) {
        TutoringOfferJpaEntity entity = TutoringOfferJpaEntity.builder()
                .id(tutoringOffer.getId())
                .tutorId(tutoringOffer.getTutorId())
                .subject(tutoringOffer.getSubject())
                .description(tutoringOffer.getDescription())
                .hourlyRate(tutoringOffer.getHourlyRate().getValue())
                .status(tutoringOffer.getStatus().name())
                .createdAt(tutoringOffer.getCreatedAt())
                .build();

        TutoringOfferJpaEntity savedEntity = jpaRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<TutoringOffer> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<TutoringOffer> findAll() {
        return jpaRepository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<TutoringOffer> findByTutorId(UUID tutorId) {
        return jpaRepository.findByTutorId(tutorId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    private TutoringOffer toDomain(TutoringOfferJpaEntity entity) {
        return new TutoringOffer(
                entity.getId(),
                entity.getTutorId(),
                entity.getSubject(),
                entity.getDescription(),
                new HourlyRate(entity.getHourlyRate().doubleValue()),
                TutoringStatus.valueOf(entity.getStatus()),
                entity.getCreatedAt()
        );
    }
}
