package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Category;
import org.uce.campusmarket.marketplace.domain.repository.CategoryRepository;
import org.uce.campusmarket.marketplace.infrastructure.mapper.CategoryMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class CategoryRepositoryAdapter implements CategoryRepository {

    private final JpaCategoryRepository jpaCategoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryRepositoryAdapter(JpaCategoryRepository jpaCategoryRepository, CategoryMapper categoryMapper) {
        this.jpaCategoryRepository = jpaCategoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public Category save(Category category) {
        CategoryJpaEntity entity = categoryMapper.toEntity(category);
        CategoryJpaEntity saved = jpaCategoryRepository.save(entity);
        return categoryMapper.toDomain(saved);
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return jpaCategoryRepository.findById(id).map(categoryMapper::toDomain);
    }

    @Override
    public List<Category> findAll() {
        return jpaCategoryRepository.findAll().stream()
                .map(categoryMapper::toDomain)
                .collect(Collectors.toList());
    }
}
