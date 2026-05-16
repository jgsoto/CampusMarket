package org.uce.campusmarket.marketplace.domain.service;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import java.util.List;
import java.util.UUID;

public interface RecommendationService {
    
    // Sugerencias basadas en el historial del usuario
    List<Listing> getRecommendationsForUser(UUID userId);
    
    // Sugerencias de productos similares al actual
    List<Listing> getRelatedListings(UUID listingId);
}
