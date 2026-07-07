package org.uce.campusmarket.marketplace.application.port;

public interface AiDescriptionPort {

    String improveDescription(String description);

    String generateDescription(String title,
                               String category);

    String generateTitle(String description);

    String correctDescription(String description);

}