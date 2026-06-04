package org.uce.campusmarket.identity.interfaces.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.identity.application.dto.UserProfileResponse;
import org.uce.campusmarket.identity.application.service.UserSyncService;
import org.uce.campusmarket.identity.application.usecase.GetCurrentUserUseCase;
import org.uce.campusmarket.identity.domain.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final UserSyncService userSyncService;
    private final GetCurrentUserUseCase getCurrentUserUseCase;

    @PostMapping("/sync")
    public UserProfileResponse synchronizeUser(@RequestBody SyncUserRequest request) {

        User user = userSyncService.synchronizeUser(
                request.clerkUserId(),
                request.fullName(),
                request.email()
        );

        return toResponse(user);
    }

    @GetMapping("/me")
    public UserProfileResponse currentUser(Authentication authentication) {

        String clerkId = authentication.getName();

        User user = getCurrentUserUseCase.execute(clerkId);

        return toResponse(user);
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
                user.getCreatedAt()
        );
    }
}