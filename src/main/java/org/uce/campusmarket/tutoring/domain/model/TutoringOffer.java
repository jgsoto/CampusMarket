package org.uce.campusmarket.tutoring.domain.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TutoringOffer {

    private UUID id;
    private UUID tutorId;
    private String subject;
    private String description;
    private HourlyRate hourlyRate;

    @Builder.Default
    private TutoringStatus status = TutoringStatus.ACTIVE;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public static TutoringOffer create(
            UUID tutorId,
            String subject,
            String description,
            HourlyRate hourlyRate
    ) {
        if (tutorId == null) {
            throw new DomainException("La tutoría debe tener un tutor");
        }

        TutoringOffer offer = TutoringOffer.builder()
                .id(UUID.randomUUID())
                .tutorId(tutorId)
                .status(TutoringStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        offer.updateDetails(
                subject,
                description,
                hourlyRate
        );

        return offer;
    }

    public void close() {
        if (this.status == TutoringStatus.CLOSED) {
            throw new DomainException("La tutoría ya se encuentra cerrada");
        }

        this.status = TutoringStatus.CLOSED;
    }

    public void updateDetails(
            String subject,
            String description,
            HourlyRate hourlyRate
    ) {
        if (this.status == TutoringStatus.CLOSED) {
            throw new DomainException("No se puede editar una tutoría cerrada");
        }

        if (subject == null || subject.trim().isEmpty()) {
            throw new DomainException("La materia o tema es obligatorio");
        }

        String normalizedSubject = subject.trim();

        if (normalizedSubject.length() < 3 || normalizedSubject.length() > 100) {
            throw new DomainException("La materia debe tener entre 3 y 100 caracteres");
        }

        if (description == null || description.trim().isEmpty()) {
            throw new DomainException("La descripción es obligatoria");
        }

        String normalizedDescription = description.trim();

        if (normalizedDescription.length() < 10 || normalizedDescription.length() > 500) {
            throw new DomainException("La descripción debe tener entre 10 y 500 caracteres");
        }

        if (hourlyRate == null) {
            throw new DomainException("La tarifa por hora es obligatoria");
        }

        this.subject = normalizedSubject;
        this.description = normalizedDescription;
        this.hourlyRate = hourlyRate;
    }
}