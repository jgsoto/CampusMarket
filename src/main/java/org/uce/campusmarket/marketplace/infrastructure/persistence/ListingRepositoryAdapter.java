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
public class ListingRepositoryAdapter implements ListingRepository {

    private final JpaListingRepository jpaListingRepository;
    private final ListingMapper listingMapper;

    public ListingRepositoryAdapter(JpaListingRepository jpaListingRepository, ListingMapper listingMapper) {
        this.jpaListingRepository = jpaListingRepository;
        this.listingMapper = listingMapper;
    }

    @Override
    public Listing save(Listing listing) {
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
