package org.uce.campusmarket.marketplace.infrastructure.mapper;

import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class ListingMapper {

    private final CategoryMapper categoryMapper;

    public ListingJpaEntity toEntity(Listing domain) {

        if (domain == null) {
            return null;
        }

        ListingJpaEntity entity = new ListingJpaEntity();

        entity.setId(domain.getId());
        entity.setTitle(domain.getTitle().getValue());
        entity.setDescription(domain.getDescription().getValue());
        entity.setPrice(domain.getPrice().getValue().doubleValue());
        entity.setCategory(categoryMapper.toEntity(domain.getCategory()));
        entity.setOwnerId(domain.getOwnerId());
        entity.setStatus(domain.getStatus().name());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setVersion(domain.getVersion());

        List<ListingImageJpaEntity> imageEntities = domain.getImages()
                .stream()
                .map(img -> {
                    ListingImageJpaEntity imageEntity = new ListingImageJpaEntity();

                    imageEntity.setId(img.getId());
                    imageEntity.setUrl(img.getUrl());
                    imageEntity.setThumbnail(img.isThumbnail());

                    return imageEntity;
                })
                .collect(Collectors.toList());

        entity.setImages(imageEntities);

        return entity;
    }

    public Listing toDomain(ListingJpaEntity entity) {

        if (entity == null) {
            return null;
        }

        Listing listing = new Listing(
                entity.getId(),
                new ListingTitle(entity.getTitle()),
                new ListingDescription(entity.getDescription()),
                Price.of(entity.getPrice()),
                categoryMapper.toDomain(entity.getCategory()),
                entity.getOwnerId()
        );

        List<ListingImage> images = entity.getImages() == null
                ? List.of()
                : entity.getImages()
                  .stream()
                  .map(img -> new ListingImage(
                          img.getId(),
                          img.getUrl(),
                          img.isThumbnail()
                  ))
                  .toList();

        listing.restoreFromPersistence(
                ListingStatus.valueOf(entity.getStatus()),
                entity.getCreatedAt(),
                entity.getVersion(),
                images
        );

        return listing;
    }
}