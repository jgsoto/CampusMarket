package org.uce.campusmarket.resource.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface JpaResourceRepository extends JpaRepository<ResourceJpaEntity, UUID> {
    
    List<ResourceJpaEntity> findByOwnerId(UUID ownerId);
    
    // Búsqueda solo por palabra clave (en título o descripción)
    List<ResourceJpaEntity> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

    // Búsqueda solo por categoría
    List<ResourceJpaEntity> findByCategory(String category);

    // Búsqueda por palabra clave Y categoría
    List<ResourceJpaEntity> findByTitleContainingIgnoreCaseAndCategoryOrDescriptionContainingIgnoreCaseAndCategory(String title, String category1, String description, String category2);
}
