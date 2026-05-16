package org.uce.campusmarket.identity.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class UserSyncService {

    private final UserRepository userRepository;

    public User synchronizeUser(
            String clerkUserId,
            String fullName,
            String email
    ) {

        return userRepository.findByClerkId(clerkUserId)
                .orElseGet(() ->
                        createUser(
                                clerkUserId,
                                fullName,
                                email
                        )
                );
    }

    private User createUser(
            String clerkUserId,
            String fullName,
            String email
    ) {

        User user = User.builder()
                .clerkId(clerkUserId)
                .fullName(fullName)
                .email(email)
                .trustScore(100.0)
                .createdAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }
}