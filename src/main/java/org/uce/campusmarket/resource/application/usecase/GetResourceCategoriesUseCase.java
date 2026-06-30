package org.uce.campusmarket.resource.application.usecase;

import org.springframework.stereotype.Service;
import org.uce.campusmarket.resource.application.dto.ResourceCategoryResponse;
import org.uce.campusmarket.resource.domain.repository.ResourceCategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GetResourceCategoriesUseCase {

    private final ResourceCategoryRepository categoryRepository;

    public GetResourceCategoriesUseCase(ResourceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<ResourceCategoryResponse> execute() {
        return categoryRepository.findAll().stream()
                .map(ResourceCategoryResponse::fromDomain)
                .collect(Collectors.toList());
    }
}
