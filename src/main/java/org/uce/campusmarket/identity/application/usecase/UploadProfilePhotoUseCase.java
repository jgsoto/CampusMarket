package org.uce.campusmarket.identity.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.application.port.ProfileImageStoragePort;
import org.uce.campusmarket.identity.domain.exception.UserNotFoundException;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UploadProfilePhotoUseCase {

    private final UserRepository userRepository;
    private final ProfileImageStoragePort profileImageStoragePort;

    public UserProfileResponse execute(UUID userId, MultipartFile file) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("Usuario no encontrado con ID: " + userId));

        // Si ya tiene una foto, eliminarla
        if (user.getPhotoUrl() != null && !user.getPhotoUrl().isBlank()) {
            profileImageStoragePort.delete(user.getPhotoUrl());
        }

        // Subir nueva foto
        String photoUrl = profileImageStoragePort.upload(file);

        // Actualizar dominio
        user.updatePhoto(photoUrl);

        userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTrustScore(),
                user.getPhone(),
                user.getAddress(),
                user.getDescription(),
                user.getSocialMedia(),
                user.getPhotoUrl(),
                user.getCreatedAt()
        );
    }
}