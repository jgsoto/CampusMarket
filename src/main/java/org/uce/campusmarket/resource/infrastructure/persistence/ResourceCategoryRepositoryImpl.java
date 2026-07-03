package org.uce.campusmarket.resource.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.uce.campusmarket.resource.domain.model.ResourceCategory;
import org.uce.campusmarket.resource.domain.repository.ResourceCategoryRepository;
import org.uce.campusmarket.resource.infrastructure.mapper.ResourceCategoryMapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class ResourceCategoryRepositoryImpl implements ResourceCategoryRepository {

    private final SpringDataResourceCategoryRepository repository;

    public ResourceCategoryRepositoryImpl(SpringDataResourceCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ResourceCategory> findAll() {
        return repository.findAll().stream()
                .map(ResourceCategoryMapper::toDomain)
                .collect(Collectors.toList());
    }
}

interface SpringDataResourceCategoryRepository extends JpaRepository<ResourceCategoryJpaEntity, UUID> {
}
