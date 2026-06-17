package org.uce.campusmarket.tutoring.domain.repository;

import org.uce.campusmarket.tutoring.domain.model.TutoringEnrollment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TutoringEnrollmentRepository {

    TutoringEnrollment save(
            TutoringEnrollment enrollment
    );

    Optional<TutoringEnrollment>
    findByTutoringOfferIdAndStudentId(
            UUID tutoringOfferId,
            UUID studentId
    );

    List<TutoringEnrollment> findByTutoringOfferId(UUID tutoringOfferId);
}