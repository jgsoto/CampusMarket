package org.uce.campusmarket.marketplace.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private UUID id;
    private String name;
    private String description;

    public static Category create(String name, String description) {
        return new Category(UUID.randomUUID(), name, description);
    }
}
