package org.uce.campusmarket.tutoring.infrastructure.persistence;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Repository;

import org.uce.campusmarket.tutoring.domain.model.TutoringEnrollment;
import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TutoringEnrollmentRepositoryImpl
                implements TutoringEnrollmentRepository {

        private final JpaTutoringEnrollmentRepository repository;

        @Override
        public TutoringEnrollment save(
                        TutoringEnrollment enrollment) {

                TutoringEnrollmentJpaEntity entity = TutoringEnrollmentJpaEntity.builder()
                                .id(enrollment.getId())
                                .tutoringOfferId(
                                                enrollment.getTutoringOfferId())
                                .studentId(
                                                enrollment.getStudentId())
                                .build();

                TutoringEnrollmentJpaEntity saved = repository.save(entity);

                return TutoringEnrollment.builder()
                                .id(saved.getId())
                                .tutoringOfferId(
                                                saved.getTutoringOfferId())
                                .studentId(
                                                saved.getStudentId())
                                .build();
        }

        @Override
        public Optional<TutoringEnrollment> findByTutoringOfferIdAndStudentId(
                        UUID tutoringOfferId,
                        UUID studentId) {

                return repository
                                .findByTutoringOfferIdAndStudentId(
                                                tutoringOfferId,
                                                studentId)
                                .map(entity -> TutoringEnrollment.builder()
                                                .id(entity.getId())
                                                .tutoringOfferId(
                                                                entity.getTutoringOfferId())
                                                .studentId(
                                                                entity.getStudentId())
                                                .build());
        }

        @Override
        public List<TutoringEnrollment> findByTutoringOfferId(UUID tutoringOfferId) {
                return repository.findByTutoringOfferId(tutoringOfferId)
                        .stream()
                        .map(entity -> TutoringEnrollment.builder()
                                .id(entity.getId())
                                .tutoringOfferId(entity.getTutoringOfferId())
                                .studentId(entity.getStudentId())
                                .build())
                        .toList();
        }
}