package org.uce.campusmarket.identity.domain.valueobject;

import org.uce.campusmarket.shared.exception.DomainException;

public class FullName {

    private final String value;

    public FullName(String value) {

        if (value == null || value.isBlank()) {
            throw new DomainException("El nombre completo es obligatorio");
        }

        if (value.trim().length() < 3 || value.trim().length() > 120) {
            throw new DomainException("El nombre completo debe tener entre 3 y 120 caracteres");
        }

        this.value = value.trim();
    }

    public String getValue() {
        return value;
    }
}