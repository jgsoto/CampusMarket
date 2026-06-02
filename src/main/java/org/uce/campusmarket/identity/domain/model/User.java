package org.uce.campusmarket.identity.domain.model;

import lombok.*;

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
}