package org.uce.campusmarket.marketplace.domain.valueobject;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

@Getter
@EqualsAndHashCode
public final class ListingDescription {
    private final String value;

    public ListingDescription(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new DomainException("La descripción no puede estar vacía");
        }

        String normalizedValue = value.trim();

        if (normalizedValue.length() < 10 || normalizedValue.length() > 1000) {
            throw new DomainException("La descripción debe tener entre 10 y 1000 caracteres");
        }

        this.value = normalizedValue;
    }
}
