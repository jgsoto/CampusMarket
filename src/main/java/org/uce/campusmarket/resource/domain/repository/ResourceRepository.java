package org.uce.campusmarket.resource.domain.repository;

import org.uce.campusmarket.resource.domain.model.Resource;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResourceRepository {
    
    Resource save(Resource resource);
    
    Optional<Resource> findById(UUID id);
    
    List<Resource> findAll();
    
    List<Resource> findByOwnerId(UUID ownerId);
    
    List<Resource> search(String keyword, String category);
    
    void deleteById(UUID id);
}
