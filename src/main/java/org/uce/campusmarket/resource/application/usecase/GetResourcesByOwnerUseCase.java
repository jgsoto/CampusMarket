package org.uce.campusmarket.resource.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.uce.campusmarket.resource.application.dto.ResourceFileResponse;
import org.uce.campusmarket.resource.application.dto.ResourceResponse;
import org.uce.campusmarket.resource.domain.model.Resource;
import org.uce.campusmarket.resource.domain.repository.ResourceRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetResourcesByOwnerUseCase {

    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public List<ResourceResponse> execute(UUID ownerId) {
        List<Resource> resources = resourceRepository.findByOwnerId(ownerId);

        return resources.stream().map(resource -> {
            User owner = userRepository.findById(resource.getOwnerId())
                    .orElse(null);

            List<ResourceFileResponse> fileResponses = resource.getFiles().stream()
                    .map(f -> new ResourceFileResponse(
                            f.getId(),
                            f.getUrl(),
                            f.getFilename(),
                            f.getFileType(),
                            f.getSize()
                    )).collect(Collectors.toList());

            return ResourceResponse.builder()
                    .id(resource.getId())
                    .ownerId(resource.getOwnerId())
                    .title(resource.getTitle())
                    .description(resource.getDescription())
                    .category(resource.getCategory())
                    .createdAt(resource.getCreatedAt())
                    .files(fileResponses)
                    .ownerName(owner != null ? owner.getFullName() : "Desconocido")
                    .ownerEmail(owner != null ? owner.getEmail() : "No disponible")
                    .build();

        }).collect(Collectors.toList());
    }
}
