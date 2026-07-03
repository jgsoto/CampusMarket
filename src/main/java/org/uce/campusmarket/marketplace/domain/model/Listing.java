package org.uce.campusmarket.marketplace.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    private final List<ListingImage> images = new ArrayList<>();

    public Listing(
            UUID id,
            ListingTitle title,
            ListingDescription description,
            Price price,
            Category category,
            UUID ownerId) {
        validateRequiredFields(title, description, price, category, ownerId);

        this.id = id != null ? id : UUID.randomUUID();
        this.title = title;
        this.description = description;
        this.price = price;
        this.category = category;
        this.ownerId = ownerId;
        this.status = ListingStatus.BORRADOR;
        this.createdAt = LocalDateTime.now();
    }

    public static Listing create(
            ListingTitle title,
            ListingDescription description,
            Price price,
            Category category,
            UUID ownerId) {
        return new Listing(
                UUID.randomUUID(),
                title,
                description,
                price,
                category,
                ownerId);
    }

    private void validateRequiredFields(
            ListingTitle title,
            ListingDescription description,
            Price price,
            Category category,
            UUID ownerId) {
        if (title == null) {
            throw new DomainException("La publicación debe tener un título");
        }

        if (description == null) {
            throw new DomainException("La publicación debe tener una descripción");
        }

        if (price == null) {
            throw new DomainException("La publicación debe tener un precio");
        }

        if (category == null) {
            throw new DomainException("La publicación debe tener una categoría");
        }

        if (ownerId == null) {
            throw new DomainException("La publicación debe tener un propietario");
        }
    }

    public List<ListingImage> getImages() {
        return Collections.unmodifiableList(images);
    }

    public void publish() {
        if (this.status != ListingStatus.BORRADOR) {
            throw new DomainException("Solo se pueden publicar productos en borrador");
        }

        this.status = ListingStatus.PUBLICADA;
    }

    public void markAsSold() {
        if (this.status != ListingStatus.PUBLICADA) {
            throw new DomainException("Solo se pueden marcar como vendidos los productos publicados");
        }

        this.status = ListingStatus.VENDIDO;
    }

    public void updateDetails(
            ListingTitle title,
            ListingDescription description,
            Price price) {
        if (this.status == ListingStatus.VENDIDO) {
            throw new DomainException("No se puede editar una publicación vendida");
        }

        this.title = title;
        this.description = description;
        this.price = price;
    }

    public void addImage(ListingImage image) {
        if (image == null) {
            return;
        }

        this.images.add(image);
    }

    public void replaceImages(List<ListingImage> newImages) {
        if (this.status == ListingStatus.VENDIDO) {
            throw new DomainException("No se pueden reemplazar imágenes de una publicación vendida");
        }

        this.images.clear();

        if (newImages != null) {
            newImages.forEach(this::addImage);
        }
    }

    public void restoreFromPersistence(
            ListingStatus status,
            LocalDateTime createdAt,
            Long version,
            List<ListingImage> images) {
        this.status = status;
        this.createdAt = createdAt;
        this.version = version;

        this.images.clear();

        if (images != null) {
            this.images.addAll(images);
        }
    }
}