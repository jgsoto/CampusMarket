package org.uce.campusmarket.tutoring.domain.model;

import org.uce.campusmarket.tutoring.domain.valueobject.HourlyRate;

import java.time.LocalDateTime;
import java.util.UUID;

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

    // Constructor para rehidratación desde base de datos
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

    public UUID getId() {
        return id;
    }

    public UUID getTutorId() {
        return tutorId;
    }

    public String getSubject() {
        return subject;
    }

    public String getDescription() {
        return description;
    }

    public HourlyRate getHourlyRate() {
        return hourlyRate;
    }

    public TutoringStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
