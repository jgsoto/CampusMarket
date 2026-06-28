package org.uce.campusmarket.resource.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Resource {

    private UUID id;
    private UUID ownerId;
    private String title;
    private String description;
    private String category;
    private LocalDateTime createdAt;

    public Resource(UUID id, UUID ownerId, String title, String description, String category) {
        validateRequiredFields(ownerId, title, description, category);

        this.id = id != null ? id : UUID.randomUUID();
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.category = category;
        this.createdAt = LocalDateTime.now();
    }

    public static Resource create(UUID ownerId, String title, String description, String category) {
        return new Resource(
                UUID.randomUUID(),
                ownerId,
                title,
                description,
                category
        );
    }

    private void validateRequiredFields(UUID ownerId, String title, String description, String category) {
        if (ownerId == null) {
            throw new DomainException("El recurso debe tener un propietario (ownerId)");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new DomainException("El recurso debe tener un título");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new DomainException("El recurso debe tener una descripción");
        }
        if (category == null || category.trim().isEmpty()) {
            throw new DomainException("El recurso debe tener una categoría");
        }
    }

    public void updateDetails(String title, String description, String category) {
        if (title == null || title.trim().isEmpty()) {
            throw new DomainException("El título no puede estar vacío al actualizar");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new DomainException("La descripción no puede estar vacía al actualizar");
        }
        
        this.title = title;
        this.description = description;
        
        if (category != null && !category.trim().isEmpty()) {
            this.category = category;
        }
    }

    public void restoreFromPersistence(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
