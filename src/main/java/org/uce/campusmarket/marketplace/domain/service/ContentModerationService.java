package org.uce.campusmarket.marketplace.domain.service;

import org.uce.campusmarket.marketplace.domain.model.Listing;

public interface ContentModerationService {

    boolean isValidContent(Listing listing);

    boolean isSafeText(String text);
}
