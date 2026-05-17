package org.uce.campusmarket.marketplace.application.usecase;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.application.dto.UpdateListingRequest;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Service
@Transactional
public class UpdateListingUseCase {

    private final ListingRepository listingRepository;

    public UpdateListingUseCase(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public ListingResponse execute(UUID listingId, UUID requesterId, UpdateListingRequest request) {
        // 1. Buscar la publicación
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new DomainException("La publicación no existe"));

        // 2. Validar que quien intenta actualizar es el dueño
        if (!listing.getOwnerId().equals(requesterId)) {
            throw new DomainException("No tienes permiso para editar esta publicación");
        }

        // 3. Crear los nuevos objetos de valor
        ListingTitle newTitle = new ListingTitle(request.getTitle());
        ListingDescription newDescription = new ListingDescription(request.getDescription());
        Price newPrice = Price.of(request.getPrice());

        // 4. Actualizar la entidad
        listing.updateDetails(newTitle, newDescription, newPrice);

        // 5. Guardar los cambios
        Listing updatedListing = listingRepository.save(listing);

        // 6. Devolver respuesta
        return new ListingResponse(
                updatedListing.getId(),
                updatedListing.getTitle().getValue(),
                updatedListing.getDescription().getValue(),
                updatedListing.getPrice().getValue().doubleValue(),
                updatedListing.getCategory().getName(),
                updatedListing.getOwnerId(),
                updatedListing.getStatus().name(),
                updatedListing.getCreatedAt()
        );
    }
}
