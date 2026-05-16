package org.uce.campusmarket.shared.security;

import com.auth0.jwt.JWT;

import com.auth0.jwt.interfaces.DecodedJWT;

import org.springframework.stereotype.Service;

@Service
public class ClerkJwtService {

    public DecodedJWT decodeToken(
            String token
    ) {

        return JWT.decode(token);
    }
}