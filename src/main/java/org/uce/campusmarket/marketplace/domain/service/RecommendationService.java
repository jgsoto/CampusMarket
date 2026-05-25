package org.uce.campusmarket.marketplace.domain.service;

import org.uce.campusmarket.marketplace.domain.model.Listing;
import java.util.List;
import java.util.UUID;

public interface RecommendationService {
    
    List<Listing> getRecommendationsForUser(UUID userId);
    
    List<Listing> getRelatedListings(UUID listingId);
}
