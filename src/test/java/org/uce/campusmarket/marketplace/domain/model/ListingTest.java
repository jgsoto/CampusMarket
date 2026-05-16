package org.uce.campusmarket.marketplace.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.shared.exception.DomainException;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ListingTest {

    @Test
    @DisplayName("Debe crear una publicación válida con estado BORRADOR")
    void createValidListing() {
        Category category = new Category(UUID.randomUUID(), "Libros", "Libros académicos");
        UUID ownerId = UUID.randomUUID();
        
        Listing listing = new Listing(
            UUID.randomUUID(),
            new ListingTitle("Libro de Java"),
            new ListingDescription("Libro en excelente estado para semestre 1"),
            Price.of(25.0),
            category,
            ownerId
        );

        assertNotNull(listing.getId());
        assertEquals(ListingStatus.BORRADOR, listing.getStatus());
        assertEquals("Libro de Java", listing.getTitle().getValue());
    }

    @Test
    @DisplayName("Debe lanzar error si el precio es negativo")
    void throwErrorWhenPriceIsNegative() {
        assertThrows(DomainException.class, () -> {
            Price.of(-10.0);
        }, "Debería haber lanzado una excepción por precio negativo");
    }

    @Test
    @DisplayName("No debe permitir publicar sin al menos una imagen")
    void cannotPublishWithoutImages() {
        Category category = new Category(UUID.randomUUID(), "Libros", "Libros académicos");
        Listing listing = new Listing(
            UUID.randomUUID(),
            new ListingTitle("Libro de Java"),
            new ListingDescription("Libro en excelente estado"),
            Price.of(25.0),
            category,
            UUID.randomUUID()
        );

        assertThrows(DomainException.class, listing::publish, 
            "No debería permitir publicar sin imágenes");
    }

    @Test
    @DisplayName("Debe permitir publicar después de añadir una imagen")
    void allowPublishWithImage() {
        Category category = new Category(UUID.randomUUID(), "Libros", "Libros académicos");
        Listing listing = new Listing(
            UUID.randomUUID(),
            new ListingTitle("Libro de Java"),
            new ListingDescription("Libro en excelente estado"),
            Price.of(25.0),
            category,
            UUID.randomUUID()
        );

        listing.addImage(ListingImage.create("http://imagen.jpg", true));
        listing.publish();

        assertEquals(ListingStatus.PUBLICADA, listing.getStatus());
    }
}
