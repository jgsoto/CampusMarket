package org.uce.campusmarket.identity.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.identity.application.dto.SyncUserRequest;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.application.service.UserSyncService;
import org.uce.campusmarket.identity.domain.model.User;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserSyncController {

    private final UserSyncService userSyncService;

    @PostMapping("/sync")
    public ResponseEntity<UserProfileResponse> synchronizeUser(
            @RequestBody SyncUserRequest request
    ) {

        User user = userSyncService.synchronizeUser(
                request.clerkUserId(),
                request.fullName(),
                request.email()
        );

        return ResponseEntity.ok(toResponse(user));
    }

    private UserProfileResponse toResponse(User user) {
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