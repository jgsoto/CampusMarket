package org.uce.campusmarket.identity.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.identity.application.dto.UserProfileRequest;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.application.usecase.GetUserProfileUseCase;
import org.uce.campusmarket.identity.application.usecase.UpdateUserProfileUseCase;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final GetUserProfileUseCase getUserProfileUseCase;
    private final UpdateUserProfileUseCase updateUserProfileUseCase;

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
}
