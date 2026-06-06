package org.uce.campusmarket.tutoring.infrastructure.persistence;

import jakarta.persistence.*;

import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "tutoring_enrollments")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TutoringEnrollmentJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tutoring_offer_id")
    private UUID tutoringOfferId;

    @Column(name = "student_id")
    private UUID studentId;
}