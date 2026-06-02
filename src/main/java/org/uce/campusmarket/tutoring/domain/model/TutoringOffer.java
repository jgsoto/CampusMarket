package org.uce.campusmarket.tutoring.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uce.campusmarket.shared.exception.DomainException;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
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

        if (subject.trim().length() < 3 || subject.trim().length() > 100) {
            throw new DomainException("La materia debe tener entre 3 y 100 caracteres");
        }

        if (description == null || description.trim().isEmpty()) {
            throw new DomainException("La descripción es obligatoria");
        }

        if (description.trim().length() < 10 || description.trim().length() > 500) {
            throw new DomainException("La descripción debe tener entre 10 y 500 caracteres");
        }

        if (hourlyRate == null) {
            throw new DomainException("La tarifa por hora es obligatoria");
        }

        this.subject = subject.trim();
        this.description = description.trim();
        this.hourlyRate = hourlyRate;
    }
}