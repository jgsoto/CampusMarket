package org.uce.campusmarket.marketplace.domain.model;

import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Listing {
    private UUID id;
    private ListingTitle title;
    private ListingDescription description;
    private Price price;
    private Category category;
    private UUID ownerId;
    private ListingStatus status;
    private LocalDateTime createdAt;
    private List<ListingImage> images = new ArrayList<>();

    public Listing() {
    }


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
        if (this.images.isEmpty()) {
            throw new DomainException("No se puede publicar sin al menos una imagen");
        }
        this.status = ListingStatus.PUBLICADA;
    }

    public void addImage(ListingImage image) {
        if (image == null) return;
        this.images.add(image);
    }

    public void markAsSold() {
        if (this.status != ListingStatus.PUBLICADA) {
            throw new DomainException("Solo se pueden marcar como vendidas las publicaciones publicadas");
        }
        this.status = ListingStatus.VENDIDO;
    }

    public void updateDetails(ListingTitle title, ListingDescription description, Price price) {
        this.title = title;
        this.description = description;
        this.price = price;
    }

    public UUID getId() {
        return id;
    }

    public ListingTitle getTitle() {
        return title;
    }

    public ListingDescription getDescription() {
        return description;
    }

    public Price getPrice() {
        return price;
    }

    public Category getCategory() {
        return category;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<ListingImage> getImages() {
        return images;
    }
}
