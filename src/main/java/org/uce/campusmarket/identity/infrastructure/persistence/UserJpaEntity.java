package org.uce.campusmarket.identity.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "clerk_id", nullable = false, unique = true)
    private String clerkId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "trust_score", nullable = false)
    private Double trustScore;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(length = 1000)
    private String description;

    @Column(name = "social_media", length = 255)
    private String socialMedia;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}