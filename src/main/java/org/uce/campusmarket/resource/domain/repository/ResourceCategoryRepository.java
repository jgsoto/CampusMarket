package org.uce.campusmarket.resource.domain.repository;

import org.uce.campusmarket.resource.domain.model.ResourceCategory;
import java.util.List;

public interface ResourceCategoryRepository {
    List<ResourceCategory> findAll();
}
