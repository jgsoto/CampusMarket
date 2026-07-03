package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.tutoring.domain.model.TutoringEnrollment;
import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GetEnrolledStudentsUseCase {

    private final TutoringEnrollmentRepository enrollmentRepository;

    public List<UUID> execute(UUID tutoringId) {

        return enrollmentRepository
                .findByTutoringOfferId(tutoringId)
                .stream()
                .map(TutoringEnrollment::getStudentId)
                .toList();
    }
}