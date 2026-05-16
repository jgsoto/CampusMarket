package org.uce.campusmarket.identity.interfaces.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.identity.application.service.UserSyncService;
import org.uce.campusmarket.identity.domain.model.User;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserSyncController {

    private final UserSyncService userSyncService;

    @PostMapping("/sync")
    public ResponseEntity<User> synchronizeUser(
            @RequestBody SyncUserRequest request
    ) {

        User user = userSyncService.synchronizeUser(
                request.clerkUserId(),
                request.fullName(),
                request.email()
        );

        return ResponseEntity.ok(user);
    }

}