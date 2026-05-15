package org.uce.campusmarket.identity.application.usecase;

import org.uce.campusmarket.identity.domain.exception.UserNotFoundException;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.model.UserStatus;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerifyStudentUseCase {

    private final UserRepository userRepository;

    public User execute(String clerkId) {

        User user = userRepository
                .findByClerkId(clerkId)
                .orElseThrow(UserNotFoundException::new);

        user.setVerified(true);
        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }
}