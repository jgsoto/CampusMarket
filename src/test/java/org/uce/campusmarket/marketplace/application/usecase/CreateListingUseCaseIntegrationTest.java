package org.uce.campusmarket.marketplace.application.usecase;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.marketplace.application.dto.CreateListingRequest;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.domain.model.Category;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingImage;
import org.uce.campusmarket.marketplace.domain.repository.CategoryRepository;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional // <- Esto asegura que los datos de prueba se borren de Supabase al terminar el
               // test
public class CreateListingUseCaseIntegrationTest {

    @Autowired
    private CreateListingUseCase createListingUseCase;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ListingRepository listingRepository;

    @Test
    @org.springframework.test.annotation.Commit
    public void testDebeCrearUnaPublicacionExitosamente() {
        // 1. Preparar: Creamos una Categoría real y la guardamos
        Category newCategory = Category.create("Electrónica", "Aparatos, computadoras y gadgets");
        Category savedCategory = categoryRepository.save(newCategory);

        // 2. Preparar: Simulamos los datos que el estudiante enviaría desde la página
        // web (El DTO)
        UUID studentId = UUID.randomUUID(); // Simulamos el ID del estudiante autenticado

        CreateListingRequest request = new CreateListingRequest(
                "Laptop Asus ROG 2024",
                "Laptop casi nueva, ideal para las clases de arquitectura de software.",
                850.0,
                savedCategory.getId(),
                studentId);

        // 3. Actuar: ¡Llamamos al Caso de Uso que acabamos de construir!
        ListingResponse response = createListingUseCase.execute(request);

        // 4. Afirmar: Comprobamos que el flujo funcionó y no dio errores
        assertNotNull(response.getId(), "La publicación debería haber recibido un ID al guardarse");
        assertEquals("Laptop Asus ROG 2024", response.getTitle());
        assertEquals(850.0, response.getPrice());
        assertEquals("Electrónica", response.getCategoryName());
        assertEquals("BORRADOR", response.getStatus()); // El estado por defecto del Dominio

        System.out.println(
                "✅ 1/2: Creación exitosa. Estado: " + response.getStatus());

        // 5. El estudiante decide subir una foto
        Listing listing = listingRepository.findById(response.getId()).get();
        listing.addImage(new ListingImage(UUID.randomUUID(), "https://imgur.com/foto-laptop.jpg", true));

        // 6. Cambiamos el estado a PUBLICADA (Esto fallaría si no tuviera imagen)
        listing.publish();

        // 7. Guardamos los cambios
        Listing publishedListing = listingRepository.save(listing);

        // 8. Verificamos que se publicó correctamente y tiene la imagen
        assertEquals("PUBLICADA", publishedListing.getStatus().name());
        assertEquals(1, publishedListing.getImages().size());

        System.out.println(
                "✅ 2/2: ¡TEST SUPERADO COMPLETAMENTE! La publicación ahora está " + publishedListing.getStatus().name() + " y tiene " + publishedListing.getImages().size() + " imagen guardada en la base de datos.");

    }
}
