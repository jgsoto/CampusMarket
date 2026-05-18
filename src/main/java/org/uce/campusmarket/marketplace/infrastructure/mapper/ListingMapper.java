package org.uce.campusmarket.marketplace.infrastructure.mapper;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingImage;
import org.uce.campusmarket.marketplace.domain.model.ListingStatus;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;
import org.uce.campusmarket.marketplace.infrastructure.persistence.ListingImageJpaEntity;
import org.uce.campusmarket.marketplace.infrastructure.persistence.ListingJpaEntity;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ListingMapper {

    private final CategoryMapper categoryMapper;

    public ListingMapper(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    public ListingJpaEntity toEntity(Listing domain) {
        if (domain == null) return null;

        ListingJpaEntity entity = new ListingJpaEntity();
        entity.setId(domain.getId());
        entity.setTitle(domain.getTitle().getValue());
        entity.setDescription(domain.getDescription().getValue());
        entity.setPrice(domain.getPrice().getValue().doubleValue());
        entity.setCategory(categoryMapper.toEntity(domain.getCategory()));
        entity.setOwnerId(domain.getOwnerId());
        entity.setStatus(domain.getStatus().name());
        entity.setCreatedAt(domain.getCreatedAt());

        List<ListingImageJpaEntity> imageEntities = domain.getImages().stream()
                .map(img -> {
                    ListingImageJpaEntity imgEntity = new ListingImageJpaEntity();
                    imgEntity.setId(img.getId());
                    imgEntity.setUrl(img.getUrl());
                    imgEntity.setThumbnail(img.isThumbnail());
                    return imgEntity;
                })
                .collect(Collectors.toList());

        entity.setImages(imageEntities);
        return entity;
    }

    public Listing toDomain(ListingJpaEntity entity) {
        if (entity == null) return null;

        Listing listing = new Listing(
                entity.getId(),
                new ListingTitle(entity.getTitle()),
                new ListingDescription(entity.getDescription()),
                Price.of(entity.getPrice()),
                categoryMapper.toDomain(entity.getCategory()),
                entity.getOwnerId()
        );

        if (entity.getStatus() != null && !entity.getStatus().equals("BORRADOR")) {
            if (entity.getStatus().equals("PUBLICADA")) {
                entity.getImages().forEach(img -> 
                    listing.addImage(new ListingImage(img.getId(), img.getUrl(), img.isThumbnail()))
                );
                listing.publish();
            } else if (entity.getStatus().equals("VENDIDO")) {
                listing.markAsSold();
            } else if (entity.getStatus().equals("ELIMINADO")) {
                listing.markAsDeleted();
            }
        }

        if (listing.getImages().isEmpty() && entity.getImages() != null) {
            entity.getImages().forEach(img -> 
                listing.addImage(new ListingImage(img.getId(), img.getUrl(), img.isThumbnail()))
            );
        }

        return listing;
    }
}
