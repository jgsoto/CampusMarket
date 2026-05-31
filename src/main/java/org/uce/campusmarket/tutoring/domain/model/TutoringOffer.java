package org.uce.campusmarket.tutoring.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
        this.status = TutoringStatus.CLOSED;
    }
}
