package org.uce.campusmarket.identity.interfaces.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.identity.application.service.UserSyncService;
import org.uce.campusmarket.identity.domain.model.User;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {

    private final UserSyncService userSyncService;

    @PostMapping("/sync")
    public ResponseEntity<User> syncUser(
            @RequestBody SyncUserRequest request
    ) {

        User user = userSyncService.synchronizeUser(
                request.clerkUserId(),
                request.fullName(),
                request.email()
        );

        return ResponseEntity.ok(user);
    }

    public record SyncUserRequest(
            String clerkUserId,
            String fullName,
            String email
    ) {
    }
}
