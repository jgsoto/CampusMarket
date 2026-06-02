package org.uce.campusmarket.identity.domain.model;

import lombok.*;
import org.uce.campusmarket.identity.domain.valueobject.Email;
import org.uce.campusmarket.identity.domain.valueobject.FullName;
import org.uce.campusmarket.identity.domain.valueobject.TrustScore;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private UUID id;

    private String clerkId;

    private String fullName;

    private String email;

    private Double trustScore;

    private String phone;

    private String address;

    private String description;

    private String socialMedia;

    private LocalDateTime createdAt;

    public static User create(
            String clerkId,
            String fullName,
            String email,
            Double trustScore
    ) {
        if (clerkId == null || clerkId.isBlank()) {
            throw new DomainException("El identificador de Clerk es obligatorio");
        }

        FullName validFullName = new FullName(fullName);
        Email validEmail = new Email(email);
        TrustScore validTrustScore = new TrustScore(trustScore);

        return User.builder()
                .clerkId(clerkId)
                .fullName(validFullName.getValue())
                .email(validEmail.getValue())
                .trustScore(validTrustScore.getValue())
                .createdAt(LocalDateTime.now())
                .build();
    }

    public void updateProfile(
            String phone,
            String address,
            String description,
            String socialMedia
    ) {
        this.phone = normalizeOptional(phone);
        this.address = normalizeOptional(address);
        this.description = normalizeOptional(description);
        this.socialMedia = normalizeOptional(socialMedia);
    }

    public void updateIdentity(
            String fullName,
            String email
    ) {
        FullName validFullName = new FullName(fullName);
        Email validEmail = new Email(email);

        this.fullName = validFullName.getValue();
        this.email = validEmail.getValue();
    }

    public void updateTrustScore(Double trustScore) {
        TrustScore validTrustScore = new TrustScore(trustScore);
        this.trustScore = validTrustScore.getValue();
    }

    private String normalizeOptional(String value) {
        return value == null || value.isBlank()
                ? null
                : value.trim();
    }
}