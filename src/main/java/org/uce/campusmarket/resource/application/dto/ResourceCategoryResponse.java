package org.uce.campusmarket.resource.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uce.campusmarket.resource.domain.model.ResourceCategory;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceCategoryResponse {
    
    private UUID id;
    private String name;
    private String description;

    public static ResourceCategoryResponse fromDomain(ResourceCategory category) {
        return new ResourceCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
}
