package org.uce.campusmarket.marketplace.domain.model;

import java.util.UUID;

public class Category {
    private UUID id;
    private String name;
    private String description;

    public Category() {
    }

    public Category(UUID id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public static Category create(String name, String description) {
        return new Category(UUID.randomUUID(), name, description);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
