package org.uce.campusmarket.resource.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.resource.application.dto.CreateResourceRequest;
import org.uce.campusmarket.resource.application.dto.ResourceResponse;
import org.uce.campusmarket.resource.application.dto.UpdateResourceRequest;
import org.uce.campusmarket.resource.application.usecase.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final CreateResourceUseCase createResourceUseCase;
    private final UpdateResourceUseCase updateResourceUseCase;
    private final DeleteResourceUseCase deleteResourceUseCase;
    private final GetResourceUseCase getResourceUseCase;
    private final SearchResourcesUseCase searchResourcesUseCase;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ResourceResponse> createResource(
            @RequestHeader("X-User-Id") UUID ownerId,
            @ModelAttribute CreateResourceRequest request) {

        // Aseguramos que el ownerId venga de la cabecera por seguridad
        request.setOwnerId(ownerId);
        ResourceResponse response = createResourceUseCase.execute(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId,
            @ModelAttribute UpdateResourceRequest request) {

        // Validamos la identidad y el recurso a modificar
        request.setResourceId(id);
        
        ResourceResponse response = updateResourceUseCase.execute(request, ownerId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResource(@PathVariable UUID id) {
        ResourceResponse response = getResourceUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponse>> searchResources(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {

        List<ResourceResponse> response = searchResourcesUseCase.execute(keyword, category);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId) {

        deleteResourceUseCase.execute(id, ownerId);

        return ResponseEntity.noContent().build();
    }
}
