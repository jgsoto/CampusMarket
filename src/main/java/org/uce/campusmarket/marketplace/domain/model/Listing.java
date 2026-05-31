package org.uce.campusmarket.marketplace.domain.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class Listing {
    private UUID id;
    private ListingTitle title;
    private ListingDescription description;
    private Price price;
    private Category category;
    private UUID ownerId;
    private ListingStatus status;
    private LocalDateTime createdAt;
    private Long version;
    private List<ListingImage> images = new ArrayList<>();

    public Listing(UUID id, ListingTitle title, ListingDescription description, Price price, 
                   Category category, UUID ownerId) {
        
        validateRequiredFields(ownerId, category);
        
        this.id = id != null ? id : UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.ownerId = ownerId;
        this.status = ListingStatus.BORRADOR;
        this.createdAt = LocalDateTime.now();
    }

    private void validateRequiredFields(UUID ownerId, Category category) {
        if (ownerId == null) {
            throw new DomainException("La publicación debe tener un propietario");
        }
        if (category == null) {
            throw new DomainException("La publicación debe tener una categoría");
        }
    }


    public void publish() {
        this.status = ListingStatus.PUBLICADA;
    }

    public void addImage(ListingImage image) {
        if (image == null) return;
        this.images.add(image);
    }

    public void markAsSold() {
        if (this.status != ListingStatus.PUBLICADA) {
            throw new DomainException("Solo se pueden marcar como vendidos los productos que estén publicados");
        }
        this.status = ListingStatus.VENDIDO;
    }

    public void markAsDeleted() {
        this.status = ListingStatus.ELIMINADO;
    }

    public void updateDetails(ListingTitle title, ListingDescription description, Price price) {
        this.title = title;
        this.description = description;
        this.price = price;
    }
}
