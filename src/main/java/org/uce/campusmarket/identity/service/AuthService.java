package org.uce.campusmarket.identity.service;

import org.uce.campusmarket.identity.model.User;
import org.uce.campusmarket.identity.repository.UserRepository;
import org.uce.campusmarket.identity.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        String encodedPassword =
                passwordEncoder.encode(user.getPassword());

        User newUser = new User(
                user.getFullName(),
                user.getEmail(),
                encodedPassword
        );

        userRepository.save(newUser);

        return jwtService.generateToken(newUser.getEmail());
    }

    public String login(User user) {

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid credentials"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        user.getPassword(),
                        existingUser.getPassword()
                );

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return jwtService.generateToken(existingUser.getEmail());
    }
}