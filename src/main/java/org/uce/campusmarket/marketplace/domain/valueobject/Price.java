package org.uce.campusmarket.marketplace.domain.valueobject;

import org.uce.campusmarket.shared.exception.DomainException;

import java.math.BigDecimal;
import java.util.Objects;

public final class Price {
    private final BigDecimal value;

    public Price(BigDecimal value) {
        if (value == null) {
            throw new DomainException("El precio no puede ser nulo");
        }
        if (value.compareTo(BigDecimal.ZERO) < 0) {
            throw new DomainException("El precio debe ser positivo");
        }
        this.value = value;
    }

    public static Price of(double value) {
        return new Price(BigDecimal.valueOf(value));
    }

    public BigDecimal getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Price price = (Price) o;
        return Objects.equals(value, price.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
