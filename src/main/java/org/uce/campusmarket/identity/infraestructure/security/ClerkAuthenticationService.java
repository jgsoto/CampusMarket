package org.uce.campusmarket.identity.infraestructure.security;

import org.springframework.stereotype.Service;

@Service
public class ClerkAuthenticationService {

    public String extractClerkId(String token) {

        return token;
    }
}