package org.uce.campusmarket.resource.infrastructure.mapper;

import org.uce.campusmarket.resource.domain.model.ResourceCategory;
import org.uce.campusmarket.resource.infrastructure.persistence.ResourceCategoryJpaEntity;

public class ResourceCategoryMapper {

    public static ResourceCategory toDomain(ResourceCategoryJpaEntity entity) {
        if (entity == null) {
            return null;
        }

        return new ResourceCategory(
                entity.getId(),
                entity.getName(),
                entity.getDescription()
        );
    }
}
