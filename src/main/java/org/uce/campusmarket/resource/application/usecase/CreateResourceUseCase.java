package org.uce.campusmarket.resource.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.resource.application.dto.CreateResourceRequest;
import org.uce.campusmarket.resource.application.dto.ResourceFileResponse;
import org.uce.campusmarket.resource.application.dto.ResourceResponse;
import org.uce.campusmarket.resource.application.port.FileStoragePort;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.model.ResourceFile;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateResourceUseCase {

    private final ResourceRepository resourceRepository;
    private final FileStoragePort fileStoragePort;

    public ResourceResponse execute(CreateResourceRequest request) {
        
        Resource newResource = Resource.create(
                request.getOwnerId(),
                request.getTitle(),
                request.getDescription(),
                request.getCategory()
        );

        List<MultipartFile> files = request.getFiles();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String fileUrl = fileStoragePort.upload(file);
                
                String filename = file.getOriginalFilename();
                String contentType = file.getContentType();
                Long size = file.getSize();

                ResourceFile resourceFile = new ResourceFile(
                        UUID.randomUUID(),
                        fileUrl,
                        filename,
                        contentType,
                        size
                );

                newResource.addFile(resourceFile);
            }
        }

        Resource savedResource = resourceRepository.save(newResource);

        List<ResourceFileResponse> fileResponses = savedResource.getFiles().stream()
                .map(f -> new ResourceFileResponse(
                        f.getId(),
                        f.getUrl(),
                        f.getFilename(),
                        f.getFileType(),
                        f.getSize()
                )).collect(Collectors.toList());

        return ResourceResponse.builder()
                .id(savedResource.getId())
                .ownerId(savedResource.getOwnerId())
                .title(savedResource.getTitle())
                .description(savedResource.getDescription())
                .category(savedResource.getCategory())
                .createdAt(savedResource.getCreatedAt())
                .files(fileResponses)
                .build();
    }
}
