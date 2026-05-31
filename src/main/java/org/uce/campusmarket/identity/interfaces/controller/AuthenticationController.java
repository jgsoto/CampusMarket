package org.uce.campusmarket.identity.interfaces.controller;

import org.uce.campusmarket.identity.application.usecase.GetCurrentUserUseCase;
import org.uce.campusmarket.identity.application.usecase.RegisterUserUseCase;
import org.uce.campusmarket.identity.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthenticationController {

    private final RegisterUserUseCase registerUserUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;

    @PostMapping("/sync")
    public User synchronizeUser(@RequestBody User user) {

        return registerUserUseCase.execute(user);
    }

    @GetMapping("/me")
    public User currentUser(Authentication authentication) {

        String clerkId = authentication.getName();

        return getCurrentUserUseCase.execute(clerkId);
    }
}