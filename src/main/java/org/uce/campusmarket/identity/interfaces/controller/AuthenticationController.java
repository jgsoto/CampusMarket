package org.uce.campusmarket.identity.interfaces.controller;

import org.uce.campusmarket.identity.application.usecase.GetCurrentUserUseCase;
import org.uce.campusmarket.identity.application.usecase.RegisterUserUseCase;
import org.uce.campusmarket.identity.application.usecase.VerifyStudentUseCase;
import org.uce.campusmarket.identity.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final RegisterUserUseCase registerUserUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final VerifyStudentUseCase verifyStudentUseCase;

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        return registerUserUseCase.execute(user);
    }

    @GetMapping("/{clerkId}")
    public User getCurrentUser(@PathVariable String clerkId) {

        return getCurrentUserUseCase.execute(clerkId);
    }

    @PutMapping("/verify/{clerkId}")
    public User verifyStudent(@PathVariable String clerkId) {

        return verifyStudentUseCase.execute(clerkId);
    }
}