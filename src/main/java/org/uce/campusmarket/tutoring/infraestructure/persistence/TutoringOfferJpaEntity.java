package org.uce.campusmarket.tutoring.infraestructure.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tutoring_offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutoringOfferJpaEntity {

    @Id
    private UUID id;

    private UUID tutorId;

    private String subject;

    private String description;

    private BigDecimal hourlyRate;

    private String status;

    private LocalDateTime createdAt;
}
