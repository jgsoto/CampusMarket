package org.uce.campusmarket.marketplace.domain.valueobject;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

@Getter
@EqualsAndHashCode
public final class ListingTitle {
    private final String value;

    public ListingTitle(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new DomainException("El título de la publicación no puede estar vacío");
        }

        String normalizedValue = value.trim();

        if (normalizedValue.length() < 5 || normalizedValue.length() > 100) {
            throw new DomainException("El título debe tener entre 5 y 100 caracteres");
        }

        this.value = normalizedValue;
    }
}
