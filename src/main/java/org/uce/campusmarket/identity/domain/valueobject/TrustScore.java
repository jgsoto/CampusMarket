package org.uce.campusmarket.identity.domain.valueobject;

import org.uce.campusmarket.shared.exception.DomainException;

public class TrustScore {

    private final Double value;

    public TrustScore(Double value) {

        if (value == null || value < 0 || value > 100) {
            throw new DomainException("El puntaje de confianza debe estar entre 0 y 100");
        }

        this.value = value;
    }

    public Double getValue() {
        return value;
    }
}