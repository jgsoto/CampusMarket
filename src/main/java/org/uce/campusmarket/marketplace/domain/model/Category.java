package org.uce.campusmarket.marketplace.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category {

    private UUID id;
    private String name;
    private String description;

    public Category(
            UUID id,
            String name,
            String description) {
        if (name == null || name.isBlank()) {
            throw new DomainException("El nombre de la categoría es obligatorio");
        }

        if (description == null || description.isBlank()) {
            throw new DomainException("La descripción de la categoría es obligatoria");
        }

        this.id = id != null ? id : UUID.randomUUID();
        this.name = name.trim();
        this.description = description.trim();
    }

}