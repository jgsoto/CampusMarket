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
public class ListingImage {
    private UUID id;
    private String url;
    private boolean thumbnail;

    public static ListingImage create(String url, boolean thumbnail) {
        return new ListingImage(UUID.randomUUID(), url, thumbnail);
    }
}
