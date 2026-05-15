package org.uce.campusmarket.identity.domain.service;

import org.springframework.stereotype.Service;

@Service
public class EmailValidationService {

    public boolean isValid(String email) {
        return email.endsWith("@uce.edu.ec");
    }
}