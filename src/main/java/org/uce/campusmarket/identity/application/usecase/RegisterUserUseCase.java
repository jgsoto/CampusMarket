package org.uce.campusmarket.identity.application.usecase;

import org.springframework.beans.factory.annotation.Autowired;
import org.uce.campusmarket.identity.domain.exception.EmailAlreadyExistsException;
import org.uce.campusmarket.identity.domain.exception.InvalidEmailException;
import org.uce.campusmarket.identity.domain.model.Role;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.model.UserStatus;
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

        validateEmailDoesNotExist(user.getEmail());

        user.setRole(Role.STUDENT);
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setVerified(false);
        user.setTrustScore(trustVerificationService.initialTrustScore());
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private void validateEmail(String email) {

        if (!emailValidationService.isValid(email)) {
            throw new InvalidEmailException();
        }
    }

    private void validateEmailDoesNotExist(String email) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException();
        }
    }
}