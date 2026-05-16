package org.uce.campusmarket.marketplace.domain.valueobject;

import org.uce.campusmarket.shared.exception.DomainException;
import java.util.Objects;

public final class ListingTitle {
    private final String value;

    public ListingTitle(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new DomainException("El título de la publicación no puede estar vacío");
        }
        if (value.length() < 5 || value.length() > 100) {
            throw new DomainException("El título debe tener entre 5 y 100 caracteres");
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
        ListingTitle that = (ListingTitle) o;
        return Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }
}
