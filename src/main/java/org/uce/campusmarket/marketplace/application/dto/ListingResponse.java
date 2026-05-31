package org.uce.campusmarket.marketplace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {

    private UUID id;
    private String title;
    private String description;
    private double price;
    private String categoryName;
    private UUID ownerId;
    private String status;
    private LocalDateTime createdAt;

    private List<ListingImageResponse> images;

    private String sellerName;
    private String sellerEmail;
    private String sellerPhone;
    private String sellerAddress;
    private String sellerSocialMedia;

    private Double averageRating;
    private Integer totalReviews;
}