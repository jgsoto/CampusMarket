package org.uce.campusmarket.marketplace.infrastructure.mapper;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Category;
import org.uce.campusmarket.marketplace.infrastructure.persistence.CategoryJpaEntity;

@Component
public class CategoryMapper {

    public CategoryJpaEntity toEntity(Category domain) {
        if (domain == null) return null;
        return new CategoryJpaEntity(
                domain.getId(),
                domain.getName(),
                domain.getDescription()
        );
    }

    public Category toDomain(CategoryJpaEntity entity) {
        if (entity == null) return null;
        return new Category(
                entity.getId(),
                entity.getName(),
                entity.getDescription()
        );
    }
}
