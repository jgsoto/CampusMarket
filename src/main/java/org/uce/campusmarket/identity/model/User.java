package org.uce.campusmarket.identity.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private double trustScore;

    private boolean verified;

    private LocalDateTime createdAt;

    public User(
            String fullName,
            String email,
            String password
    ) {
        validateFullName(fullName);
        validateEmail(email);
        validatePassword(password);

        this.id = UUID.randomUUID();
        this.fullName = fullName;
        this.email = email.toLowerCase();
        this.password = password;
        this.role = Role.STUDENT;
        this.trustScore = 0.0;
        this.verified = false;
        this.createdAt = LocalDateTime.now();
    }

    public void verify() {
        this.verified = true;
    }

    public void changePassword(String newPassword) {
        validatePassword(newPassword);
        this.password = newPassword;
    }

    private void validateFullName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException("Invalid full name");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !email.endsWith("@uce.edu.ec")) {
            throw new IllegalArgumentException("Invalid institutional email");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Invalid password");
        }
    }
}