package org.uce.campusmarket.resource.infrastructure.mapper;

import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.model.ResourceFile;
import org.uce.campusmarket.resource.infrastructure.persistence.ResourceFileJpaEntity;
import org.uce.campusmarket.resource.infrastructure.persistence.ResourceJpaEntity;

import java.util.List;
import java.util.stream.Collectors;

public class ResourceMapper {

    public static ResourceJpaEntity toJpaEntity(Resource resource) {
        if (resource == null) {
            return null;
        }

        ResourceJpaEntity entity = new ResourceJpaEntity();
        entity.setId(resource.getId());
        entity.setOwnerId(resource.getOwnerId());
        entity.setTitle(resource.getTitle());
        entity.setDescription(resource.getDescription());
        entity.setCategory(resource.getCategory());
        entity.setCreatedAt(resource.getCreatedAt());

        if (resource.getFiles() != null) {
            List<ResourceFileJpaEntity> fileEntities = resource.getFiles().stream()
                    .map(file -> {
                        ResourceFileJpaEntity fileEntity = new ResourceFileJpaEntity();
                        fileEntity.setId(file.getId());
                        fileEntity.setUrl(file.getUrl());
                        fileEntity.setFilename(file.getFilename());
                        fileEntity.setFileType(file.getFileType());
                        fileEntity.setSize(file.getSize());
                        fileEntity.setResource(entity);
                        return fileEntity;
                    })
                    .collect(Collectors.toList());
            entity.setFiles(fileEntities);
        }

        return entity;
    }

    public static Resource toDomainEntity(ResourceJpaEntity entity) {
        if (entity == null) {
            return null;
        }

        Resource resource = new Resource(
                entity.getId(),
                entity.getOwnerId(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getCategory()
        );

        List<ResourceFile> domainFiles = null;
        if (entity.getFiles() != null) {
            domainFiles = entity.getFiles().stream()
                    .map(fileEntity -> new ResourceFile(
                            fileEntity.getId(),
                            fileEntity.getUrl(),
                            fileEntity.getFilename(),
                            fileEntity.getFileType(),
                            fileEntity.getSize()
                    ))
                    .collect(Collectors.toList());
        }

        resource.restoreFromPersistence(entity.getCreatedAt(), domainFiles);
        return resource;
    }
}
