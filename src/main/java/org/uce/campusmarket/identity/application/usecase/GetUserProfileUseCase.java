package org.uce.campusmarket.identity.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.domain.exception.UserNotFoundException;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetUserProfileUseCase {

    private final UserRepository userRepository;

    public UserProfileResponse execute(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTrustScore(),
                user.getPhone(),
                user.getAddress(),
                user.getDescription(),
                user.getSocialMedia(),
                user.getCreatedAt()
        );
    }
}
