package org.uce.campusmarket.identity.domain.service;

import org.springframework.stereotype.Service;

@Service
public class TrustVerificationService {

    public Double initialTrustScore() {
        return 100.0;
    }
}