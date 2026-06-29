package org.uce.campusmarket.resource.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.resource.application.port.FileStoragePort;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class DeleteResourceUseCase {

    private final ResourceRepository resourceRepository;
    private final FileStoragePort fileStoragePort;

    public void execute(UUID resourceId, UUID requesterId) {
        
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new DomainException("El recurso especificado no existe"));

        if (!resource.getOwnerId().equals(requesterId)) {
            throw new DomainException("No tienes permiso para eliminar este recurso");
        }

        if (resource.getFiles() != null && !resource.getFiles().isEmpty()) {
            resource.getFiles().forEach(file -> fileStoragePort.delete(file.getUrl()));
        }

        resourceRepository.deleteById(resourceId);
    }
}
