package org.uce.campusmarket.identity.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.identity.application.usecase.UploadProfilePhotoUseCase;
import org.uce.campusmarket.identity.application.dto.BasicUserResponse;
import org.uce.campusmarket.identity.application.dto.UserProfileRequest;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.application.usecase.GetUserProfileUseCase;
import org.uce.campusmarket.identity.application.usecase.UpdateUserProfileUseCase;
import org.uce.campusmarket.identity.application.usecase.GetUsersUseCase;
import org.uce.campusmarket.identity.application.usecase.UploadProfilePhotoUseCase;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final GetUserProfileUseCase getUserProfileUseCase;
    private final UpdateUserProfileUseCase updateUserProfileUseCase;
    private final GetUsersUseCase getUsersByIdsUseCase;
    private final UploadProfilePhotoUseCase uploadProfilePhotoUseCase;

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable UUID id) {
        UserProfileResponse response = getUserProfileUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateProfile(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody UserProfileRequest request
    ) {
        updateUserProfileUseCase.execute(userId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping(
            value = "/photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserProfileResponse> uploadPhoto(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam("file") MultipartFile file
    ) {

        UserProfileResponse response =
                uploadProfilePhotoUseCase.execute(userId, file);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<BasicUserResponse>> getUsersByIds(
            @RequestBody List<UUID> ids
    ) {
        return ResponseEntity.ok(
                getUsersByIdsUseCase.execute(ids)
        );
    }
}
