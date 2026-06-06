package org.uce.campusmarket.infrastructure.security;

import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Service;

@Service
public class ClerkTokenService {

    public String extractClerkId(String token) {

        try {

            SignedJWT signedJWT = SignedJWT.parse(token);

            return signedJWT
                    .getJWTClaimsSet()
                    .getSubject();

        } catch (Exception exception) {

            throw new RuntimeException("Invalid token");
        }
    }
}