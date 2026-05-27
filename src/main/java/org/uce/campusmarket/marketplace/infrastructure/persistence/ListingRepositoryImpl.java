package org.uce.campusmarket.marketplace.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.infrastructure.mapper.ListingMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ListingRepositoryImpl implements ListingRepository {

    private final JpaListingRepository jpaListingRepository;
    private final ListingMapper listingMapper;

    @Override
    public Listing save(Listing listing) {
        // Si el registro ya existe, actualizamos sus campos en la entidad
        // gestionada por JPA para no perder el tracking de imágenes (orphanRemoval)
        Optional<ListingJpaEntity> existing = jpaListingRepository.findById(listing.getId());

        if (existing.isPresent()) {
            ListingJpaEntity managed = existing.get();
            ListingJpaEntity updated = listingMapper.toEntity(listing);

            // Actualizar solo los campos editables
            managed.setTitle(updated.getTitle());
            managed.setDescription(updated.getDescription());
            managed.setPrice(updated.getPrice());
            managed.setStatus(updated.getStatus());

            // FIX: Evitar NullPointerException en Hibernate al actualizar registros antiguos
            // que tienen la columna "version" en NULL en la base de datos.
            if (updated.getVersion() != null) {
                managed.setVersion(updated.getVersion());
            } else if (managed.getVersion() == null) {
                managed.setVersion(0L);
            }

            // Solo reemplazar imágenes si la nueva lista no está vacía
            if (updated.getImages() != null) {
                // Mapear imágenes existentes por su ID para reutilizar las entidades gestionadas por JPA
                java.util.Map<UUID, ListingImageJpaEntity> existingImages = managed.getImages().stream()
                        .filter(img -> img.getId() != null)
                        .collect(Collectors.toMap(ListingImageJpaEntity::getId, img -> img));

                java.util.List<ListingImageJpaEntity> finalImages = new java.util.ArrayList<>();
                for (ListingImageJpaEntity updatedImg : updated.getImages()) {
                    ListingImageJpaEntity existingImg = null;
                    if (updatedImg.getId() != null) {
                        existingImg = existingImages.get(updatedImg.getId());
                    }
                    if (existingImg != null) {
                        // Reutilizar la misma instancia de entidad gestionada por JPA para evitar duplicados en la sesión de Hibernate
                        existingImg.setUrl(updatedImg.getUrl());
                        existingImg.setThumbnail(updatedImg.isThumbnail());
                        finalImages.add(existingImg);
                    } else {
                        // Si es nueva, la asociamos y agregamos
                        if (updatedImg.getId() == null) {
                            updatedImg.setId(UUID.randomUUID());
                        }
                        updatedImg.setListing(managed);
                        finalImages.add(updatedImg);
                    }
                }
                managed.getImages().clear();
                managed.getImages().addAll(finalImages);
            }

            ListingJpaEntity saved = jpaListingRepository.save(managed);
            return listingMapper.toDomain(saved);
        }

        // Si es nuevo, lo creamos normalmente
        ListingJpaEntity entity = listingMapper.toEntity(listing);
        
        // Es necesario establecer la relación inversa para cada imagen
        // para que Hibernate asigne correctamente el foreign key 'listing_id'
        if (entity.getImages() != null) {
            for (ListingImageJpaEntity img : entity.getImages()) {
                img.setListing(entity);
            }
        }
        
        ListingJpaEntity saved = jpaListingRepository.save(entity);
        return listingMapper.toDomain(saved);
    }

    @Override
    public Optional<Listing> findById(UUID id) {
        return jpaListingRepository.findById(id).map(listingMapper::toDomain);
    }

    @Override
    public List<Listing> findAll() {
        return jpaListingRepository.findAll().stream()
                .map(listingMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaListingRepository.deleteById(id);
    }
}
