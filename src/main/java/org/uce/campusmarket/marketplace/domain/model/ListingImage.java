package org.uce.campusmarket.marketplace.domain.model;

import java.util.UUID;

public class ListingImage {
    private UUID id;
    private String url;
    private boolean thumbnail;

    public ListingImage() {
    }

    public ListingImage(UUID id, String url, boolean thumbnail) {
        this.id = id;
        this.url = url;
        this.thumbnail = thumbnail;
    }

    public static ListingImage create(String url, boolean thumbnail) {
        return new ListingImage(UUID.randomUUID(), url, thumbnail);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(boolean thumbnail) {
        this.thumbnail = thumbnail;
    }
}
