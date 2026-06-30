package org.uce.campusmarket.resource.interfaces.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.uce.campusmarket.resource.application.dto.ResourceCategoryResponse;
import org.uce.campusmarket.resource.application.usecase.GetResourceCategoriesUseCase;

import java.util.List;

@RestController
@RequestMapping("/api/resources/categories")
public class ResourceCategoryController {

    private final GetResourceCategoriesUseCase getResourceCategoriesUseCase;

    public ResourceCategoryController(GetResourceCategoriesUseCase getResourceCategoriesUseCase) {
        this.getResourceCategoriesUseCase = getResourceCategoriesUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ResourceCategoryResponse>> getCategories() {
        return ResponseEntity.ok(getResourceCategoriesUseCase.execute());
    }
}
