package org.uce.campusmarket.marketplace.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ListingImage {

    private UUID id;
    private String url;
    private boolean thumbnail;

    public ListingImage(
            UUID id,
            String url,
            boolean thumbnail
    ) {
        if (url == null || url.isBlank()) {
            throw new DomainException("La URL de la imagen es obligatoria");
        }

        this.id = id != null ? id : UUID.randomUUID();
        this.url = url.trim();
        this.thumbnail = thumbnail;
    }

    public static ListingImage create(String url, boolean thumbnail) {
        return new ListingImage(UUID.randomUUID(), url, thumbnail);
    }
}