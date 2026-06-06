package org.uce.campusmarket.marketplace.domain.valueobject;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

import java.math.BigDecimal;

@Getter
@EqualsAndHashCode
public final class Price {
    private final BigDecimal value;

    public Price(BigDecimal value) {
        if (value == null) {
            throw new DomainException("El precio no puede ser nulo");
        }

        if (value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new DomainException("El precio debe ser mayor a 0");
        }

        this.value = value;
    }

    public static Price of(double value) {
        return new Price(BigDecimal.valueOf(value));
    }
}
