package org.uce.campusmarket.marketplace.application.usecase;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.CategoryResponse;
import org.uce.campusmarket.marketplace.domain.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class GetCategoriesUseCase {
    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> execute() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getDescription()

                ))
                .collect(Collectors.toList());
    }
}
