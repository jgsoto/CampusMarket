package org.uce.campusmarket.identity.application.usecase;

import org.uce.campusmarket.identity.domain.exception.InvalidEmailException;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.uce.campusmarket.identity.domain.service.TrustVerificationService;
import org.uce.campusmarket.identity.domain.service.EmailValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final EmailValidationService emailValidationService;
    private final TrustVerificationService trustVerificationService;

    public User execute(User user) {

        validateEmail(user.getEmail());

        return userRepository
                .findByEmail(user.getEmail())
                .orElseGet(() -> createUser(user));
    }

    private void validateEmail(String email) {

        if (!emailValidationService.isValid(email)) {
            throw new InvalidEmailException();
        }
    }

    private User createUser(User user) {

        user.setTrustScore(trustVerificationService.initialTrustScore());
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}