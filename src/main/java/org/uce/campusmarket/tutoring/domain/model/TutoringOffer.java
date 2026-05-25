package org.uce.campusmarket.tutoring.domain.model;

import lombok.Getter;
import lombok.Setter;
import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
public class TutoringOffer {

    private UUID id;
    private UUID tutorId;
    private String subject;
    private String description;
    private HourlyRate hourlyRate;
    private TutoringStatus status;
    private LocalDateTime createdAt;

    public TutoringOffer(UUID id, UUID tutorId, String subject, String description, HourlyRate hourlyRate) {
        this.id = id;
        this.tutorId = tutorId;
        this.subject = subject;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.status = TutoringStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    public TutoringOffer(UUID id, UUID tutorId, String subject, String description, HourlyRate hourlyRate, TutoringStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.tutorId = tutorId;
        this.subject = subject;
        this.description = description;
        this.hourlyRate = hourlyRate;
        this.status = status;
        this.createdAt = createdAt;
    }

    public void close() {
        this.status = TutoringStatus.CLOSED;
    }
}
