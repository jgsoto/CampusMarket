package org.uce.campusmarket.identity.controller;

import org.uce.campusmarket.identity.model.User;
import org.uce.campusmarket.identity.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody User user
    ) {
        return ResponseEntity.ok(
                authService.register(user)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody User user
    ) {
        return ResponseEntity.ok(
                authService.login(user)
        );
    }
}
