package org.uce.campusmarket.tutoring.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaTutoringEnrollmentRepository
                extends JpaRepository<TutoringEnrollmentJpaEntity, UUID> {

        Optional<TutoringEnrollmentJpaEntity> findByTutoringOfferIdAndStudentId(
                        UUID tutoringOfferId,
                        UUID studentId);
}