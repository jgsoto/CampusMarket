package org.uce.campusmarket.tutoring.domain.valueobject;

import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

import java.math.BigDecimal;

public class HourlyRate {

    @Getter
    private final BigDecimal value;

    public HourlyRate(Double value) {
        if (value == null || value <= 0) {
            throw new DomainException("La tarifa por hora debe ser mayor a 0");
        }

        this.value = BigDecimal.valueOf(value);
    }
}