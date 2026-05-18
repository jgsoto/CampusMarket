package org.uce.campusmarket.marketplace.application.dto;

import java.util.UUID;

public class CreateListingRequest {
    private String title;
    private String description;
    private double price;
    private UUID categoryId;
    private UUID ownerId;
    private boolean publish;

    public CreateListingRequest() {
    }

    public CreateListingRequest(String title, String description, double price, UUID categoryId, UUID ownerId, boolean publish) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.ownerId = ownerId;
        this.publish = publish;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public UUID getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(UUID ownerId) {
        this.ownerId = ownerId;
    }

    public boolean isPublish() {
        return publish;
    }

    public void setPublish(boolean publish) {
        this.publish = publish;
    }
}
