package org.uce.campusmarket.resource.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;
import org.uce.campusmarket.resource.infrastructure.mapper.ResourceMapper;
import org.uce.campusmarket.resource.domain.model.ResourceFile;

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
        if (resource.getId() != null && jpaRepository.existsById(resource.getId())) {
            ResourceJpaEntity existingEntity = jpaRepository.findById(resource.getId())
                    .orElseThrow(() -> new RuntimeException("Resource not found"));
            
            existingEntity.setTitle(resource.getTitle());
            existingEntity.setDescription(resource.getDescription());
            existingEntity.setCategory(resource.getCategory());
            
            // Update files collection carefully to trigger orphan removal
            List<UUID> domainFileIds = resource.getFiles().stream()
                    .map(ResourceFile::getId)
                    .collect(Collectors.toList());
            
            // Remove missing files
            existingEntity.getFiles().removeIf(fileEntity -> !domainFileIds.contains(fileEntity.getId()));
            
            // Add new files
            for (ResourceFile domainFile : resource.getFiles()) {
                boolean exists = existingEntity.getFiles().stream()
                        .anyMatch(f -> f.getId().equals(domainFile.getId()));
                
                if (!exists) {
                    ResourceFileJpaEntity newFileEntity = new ResourceFileJpaEntity();
                    newFileEntity.setId(domainFile.getId());
                    newFileEntity.setUrl(domainFile.getUrl());
                    newFileEntity.setFilename(domainFile.getFilename());
                    newFileEntity.setFileType(domainFile.getFileType());
                    newFileEntity.setSize(domainFile.getSize());
                    newFileEntity.setResource(existingEntity);
                    existingEntity.getFiles().add(newFileEntity);
                }
            }
            
            ResourceJpaEntity savedEntity = jpaRepository.save(existingEntity);
            return ResourceMapper.toDomainEntity(savedEntity);
            
        } else {
            ResourceJpaEntity entity = ResourceMapper.toJpaEntity(resource);
            ResourceJpaEntity savedEntity = jpaRepository.save(entity);
            return ResourceMapper.toDomainEntity(savedEntity);
        }
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
