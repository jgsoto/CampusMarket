package org.uce.campusmarket.marketplace.domain.service;

import org.uce.campusmarket.marketplace.domain.model.Listing;

public interface ContentModerationService {

    // Valida si el contenido de la publicación cumple las políticas
    boolean isValidContent(Listing listing);

    // Revisa si el texto contiene lenguaje prohibido
    boolean isSafeText(String text);
}
