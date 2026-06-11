package org.uce.campusmarket.tutoring.domain.model;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TutoringEnrollment {

    private UUID id;

    private UUID tutoringOfferId;

    private UUID studentId;

    @Builder
    public TutoringEnrollment(
            UUID id,
            UUID tutoringOfferId,
            UUID studentId
    ) {
        if (tutoringOfferId == null) {
            throw new DomainException("La inscripción debe pertenecer a una tutoría");
        }

        if (studentId == null) {
            throw new DomainException("La inscripción debe tener un estudiante");
        }

        this.id = id;
        this.tutoringOfferId = tutoringOfferId;
        this.studentId = studentId;
    }

    public static TutoringEnrollment create(
            UUID tutoringOfferId,
            UUID studentId
    ) {
        return new TutoringEnrollment(
                null,
                tutoringOfferId,
                studentId
        );
    }
}