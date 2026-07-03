package org.uce.campusmarket.resource.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;
import org.uce.campusmarket.resource.infrastructure.mapper.ResourceMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ResourceRepositoryImpl implements ResourceRepository {

    private final JpaResourceRepository jpaRepository;

    @Override
    public Resource save(Resource resource) {
        ResourceJpaEntity entity = ResourceMapper.toJpaEntity(resource);
        ResourceJpaEntity savedEntity = jpaRepository.save(entity);
        return ResourceMapper.toDomainEntity(savedEntity);
    }

    @Override
    public Optional<Resource> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(ResourceMapper::toDomainEntity);
    }

    @Override
    public List<Resource> findAll() {
        return jpaRepository.findAll().stream()
                .map(ResourceMapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Resource> findByOwnerId(UUID ownerId) {
        return jpaRepository.findByOwnerId(ownerId).stream()
                .map(ResourceMapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<Resource> search(String keyword, String category) {
        List<ResourceJpaEntity> entities;

        boolean hasKeyword = (keyword != null && !keyword.trim().isEmpty());
        boolean hasCategory = (category != null && !category.trim().isEmpty());

        if (hasKeyword && hasCategory) {
            entities = jpaRepository.findByTitleContainingIgnoreCaseAndCategoryOrDescriptionContainingIgnoreCaseAndCategory(
                    keyword, category, keyword, category);
        } else if (hasKeyword) {
            entities = jpaRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
        } else if (hasCategory) {
            entities = jpaRepository.findByCategory(category);
        } else {
            entities = jpaRepository.findAll();
        }

        return entities.stream()
                .map(ResourceMapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
}
