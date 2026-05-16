package org.uce.campusmarket.marketplace.domain.valueobject;

import org.uce.campusmarket.shared.exception.DomainException;
import java.util.Objects;

public final class ListingDescription {
    private final String value;

    public ListingDescription(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new DomainException("La descripción no puede estar vacía");
        }
        if (value.length() < 10 || value.length() > 1000) {
            throw new DomainException("La descripción debe tener entre 10 y 1000 caracteres");
        }
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ListingDescription that = (ListingDescription) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
