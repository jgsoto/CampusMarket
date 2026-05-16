package org.uce.campusmarket.identity.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.identity.domain.model.Role;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserSyncService {

    private final UserRepository userRepository;

    public User synchronizeUser(
            String clerkUserId,
            String fullName,
            String email
    ) {

        return userRepository.findByClerkId(clerkUserId)
                .orElseGet(() -> createUser(clerkUserId, fullName, email));
    }

    private User createUser(
            String clerkUserId,
            String fullName,
            String email
    ) {

        User user = User.builder()
                .id(UUID.randomUUID())
                .clerkId(clerkUserId)
                .fullName(fullName)
                .email(email)
                .trustScore(100.0)
                .role(Role.STUDENT)
                .verified(true)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }
}