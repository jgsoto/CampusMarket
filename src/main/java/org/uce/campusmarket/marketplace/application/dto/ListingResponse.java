package org.uce.campusmarket.marketplace.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ListingResponse {
    private UUID id;
    private String title;
    private String description;
    private double price;
    private String categoryName;
    private UUID ownerId;
    private String status;
    private LocalDateTime createdAt;

    public ListingResponse() {
    }

    public ListingResponse(UUID id, String title, String description, double price, 
                           String categoryName, UUID ownerId, String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.categoryName = categoryName;
        this.ownerId = ownerId;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
