package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.CreateListingRequest;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Category;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.CategoryRepository;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@Transactional
public class CreateListingUseCase {

    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;

    public CreateListingUseCase(ListingRepository listingRepository, CategoryRepository categoryRepository) {
        this.listingRepository = listingRepository;
        this.categoryRepository = categoryRepository;
    }

    public ListingResponse execute(CreateListingRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new DomainException("La categoría especificada no existe"));

        ListingTitle title = new ListingTitle(request.getTitle());
        ListingDescription description = new ListingDescription(request.getDescription());
        Price price = Price.of(request.getPrice());

        Listing newListing = new Listing(
                UUID.randomUUID(),
                title,
                description,
                price,
                category,
                request.getOwnerId()
        );

        if (request.isPublish()) {
            newListing.publish();
        }

        Listing savedListing = listingRepository.save(newListing);

        return new ListingResponse(
                savedListing.getId(),
                savedListing.getTitle().getValue(),
                savedListing.getDescription().getValue(),
                savedListing.getPrice().getValue().doubleValue(),
                savedListing.getCategory().getName(),
                savedListing.getOwnerId(),
                savedListing.getStatus().name(),
                savedListing.getCreatedAt()
        );
    }
}
