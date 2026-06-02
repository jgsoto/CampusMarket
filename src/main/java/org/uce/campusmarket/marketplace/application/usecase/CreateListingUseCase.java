package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import org.uce.campusmarket.marketplace.application.dto.CreateListingRequest;
import org.uce.campusmarket.marketplace.application.dto.ListingImageResponse;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.application.port.ImageStoragePort;

import org.uce.campusmarket.marketplace.domain.model.Category;
import org.uce.campusmarket.marketplace.domain.model.Listing;
import org.uce.campusmarket.marketplace.domain.model.ListingImage;

import org.uce.campusmarket.marketplace.domain.repository.CategoryRepository;
import org.uce.campusmarket.marketplace.domain.repository.ListingRepository;

import org.uce.campusmarket.marketplace.domain.valueobject.ListingDescription;
import org.uce.campusmarket.marketplace.domain.valueobject.ListingTitle;
import org.uce.campusmarket.marketplace.domain.valueobject.Price;

import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.shared.exception.DomainException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class CreateListingUseCase {

    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;
    private final ImageStoragePort imageStoragePort;
    private final ReviewRepository reviewRepository;

    public ListingResponse execute(CreateListingRequest request) {

        Category category = categoryRepository.findById(
                request.getCategoryId()
        ).orElseThrow(() ->
                new DomainException(
                        "La categoría especificada no existe"
                )
        );

        Listing newListing = new Listing(
                UUID.randomUUID(),
                new ListingTitle(request.getTitle()),
                new ListingDescription(request.getDescription()),
                Price.of(request.getPrice()),
                category,
                request.getOwnerId()
        );

        List<MultipartFile> images = request.getImages();

        if (images != null && !images.isEmpty()) {

            for (int i = 0; i < images.size(); i++) {

                MultipartFile file = images.get(i);

                String imageUrl = imageStoragePort.upload(file);

                ListingImage listingImage = new ListingImage(
                        UUID.randomUUID(),
                        imageUrl,
                        i == 0
                );

                newListing.addImage(listingImage);
            }
        }

        if (request.isPublish()) {
            newListing.publish();
        }

        Listing savedListing = listingRepository.save(newListing);

        List<ListingImageResponse> imageResponses = savedListing.getImages()
                .stream()
                .map(img -> new ListingImageResponse(
                        img.getUrl(),
                        img.isThumbnail()
                ))
                .toList();

        Double averageRating =
                reviewRepository.getAverageRatingByReviewedUserId(
                        savedListing.getOwnerId()
                );

        Integer totalReviews =
                reviewRepository.countByReviewedUserId(
                        savedListing.getOwnerId()
                );

        return new ListingResponse(
                savedListing.getId(),
                savedListing.getTitle().getValue(),
                savedListing.getDescription().getValue(),
                savedListing.getPrice().getValue().doubleValue(),
                savedListing.getCategory().getName(),
                savedListing.getOwnerId(),
                savedListing.getStatus().name(),
                savedListing.getCreatedAt(),
                imageResponses,
                null,
                null,
                null,
                null,
                null,
                averageRating,
                totalReviews
        );
    }
}