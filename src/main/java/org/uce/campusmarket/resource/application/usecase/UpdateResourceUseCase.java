package org.uce.campusmarket.resource.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.resource.application.dto.ResourceFileResponse;
import org.uce.campusmarket.resource.application.dto.ResourceResponse;
import org.uce.campusmarket.resource.application.dto.UpdateResourceRequest;
import org.uce.campusmarket.resource.application.port.FileStoragePort;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.model.ResourceFile;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UpdateResourceUseCase {

    private final ResourceRepository resourceRepository;
    private final FileStoragePort fileStoragePort;

    public ResourceResponse execute(UpdateResourceRequest request, UUID requesterId) {
        
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new DomainException("El recurso especificado no existe"));

        if (!resource.getOwnerId().equals(requesterId)) {
            throw new DomainException("No tienes permiso para actualizar este recurso");
        }

        resource.updateDetails(
                request.getTitle(),
                request.getDescription(),
                request.getCategory()
        );

        List<MultipartFile> newFiles = request.getNewFiles();

        if (newFiles != null && !newFiles.isEmpty()) {
            for (MultipartFile file : newFiles) {
                String fileUrl = fileStoragePort.upload(file);
                
                ResourceFile resourceFile = new ResourceFile(
                        UUID.randomUUID(),
                        fileUrl,
                        file.getOriginalFilename(),
                        file.getContentType(),
                        file.getSize()
                );

                resource.addFile(resourceFile);
            }
        }

        Resource updatedResource = resourceRepository.save(resource);

        List<ResourceFileResponse> fileResponses = updatedResource.getFiles().stream()
                .map(f -> new ResourceFileResponse(
                        f.getId(),
                        f.getUrl(),
                        f.getFilename(),
                        f.getFileType(),
                        f.getSize()
                )).collect(Collectors.toList());

        return ResourceResponse.builder()
                .id(updatedResource.getId())
                .ownerId(updatedResource.getOwnerId())
                .title(updatedResource.getTitle())
                .description(updatedResource.getDescription())
                .category(updatedResource.getCategory())
                .createdAt(updatedResource.getCreatedAt())
                .files(fileResponses)
                .build();
    }
}
