package org.uce.campusmarket.tutoring.application.usecase;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.shared.exception.DomainException;
import org.uce.campusmarket.tutoring.domain.model.TutoringEnrollment;
import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;
import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EnrollInTutoringUseCase {

    private final TutoringOfferRepository tutoringOfferRepository;

    private final TutoringEnrollmentRepository
            tutoringEnrollmentRepository;

    public void execute(
            UUID tutoringId,
            UUID studentId
    ) {

        TutoringOffer tutoring =
                tutoringOfferRepository
                        .findById(tutoringId)
                        .orElseThrow(() ->
                                new DomainException(
                                        "Tutoría no encontrada"
                                )
                        );

        boolean alreadyEnrolled =
                tutoringEnrollmentRepository
                        .findByTutoringOfferIdAndStudentId(
                                tutoringId,
                                studentId
                        )
                        .isPresent();

        if (alreadyEnrolled) {

            throw new DomainException(
                    "Ya estás inscrito"
            );
        }

        TutoringEnrollment enrollment =
                new TutoringEnrollment(
                        null,
                        tutoringId,
                        studentId
                );

        tutoringEnrollmentRepository
                .save(enrollment);
    }
}