package org.uce.campusmarket.identity.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.application.dto.UserProfileRequest;
import org.uce.campusmarket.identity.domain.exception.UserNotFoundException;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateUserProfileUseCase {

    private final UserRepository userRepository;

    public void execute(UUID userId, UserProfileRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        user.updateProfile(request.phone(), request.address(), request.description(), request.socialMedia());

        userRepository.save(user);
    }
}
