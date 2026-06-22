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

        Optional<ListingJpaEntity> existing = jpaListingRepository.findById(listing.getId());

        if (existing.isPresent()) {
            ListingJpaEntity managed = existing.get();
            ListingJpaEntity updated = listingMapper.toEntity(listing);

            managed.setTitle(updated.getTitle());
            managed.setDescription(updated.getDescription());
            managed.setPrice(updated.getPrice());
            managed.setStatus(updated.getStatus());

            if (updated.getImages() != null) {
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
                        existingImg.setUrl(updatedImg.getUrl());
                        existingImg.setThumbnail(updatedImg.isThumbnail());
                        finalImages.add(existingImg);
                    } else {
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
        ListingJpaEntity entity = listingMapper.toEntity(listing);

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
