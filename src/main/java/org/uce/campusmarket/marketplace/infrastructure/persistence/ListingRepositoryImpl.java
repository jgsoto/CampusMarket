package org.uce.campusmarket.marketplace.infrastructure.persistence;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;
import org.uce.campusmarket.marketplace.infrastructure.mapper.ListingMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ListingRepositoryImpl implements ListingRepository {

    private final JpaListingRepository jpaListingRepository;
    private final ListingMapper listingMapper;

    public ListingRepositoryImpl(JpaListingRepository jpaListingRepository, ListingMapper listingMapper) {
        this.jpaListingRepository = jpaListingRepository;
        this.listingMapper = listingMapper;
    }

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

            // Solo reemplazar imágenes si la nueva lista no está vacía
            if (updated.getImages() != null && !updated.getImages().isEmpty()) {
                managed.getImages().clear();
                for (ListingImageJpaEntity img : updated.getImages()) {
                    img.setListing(managed);
                    managed.getImages().add(img);
                }
            }

            ListingJpaEntity saved = jpaListingRepository.save(managed);
            return listingMapper.toDomain(saved);
        }

        // Si es nuevo, lo creamos normalmente
        ListingJpaEntity entity = listingMapper.toEntity(listing);
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
