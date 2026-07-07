package org.uce.campusmarket.marketplace.infrastructure.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.uce.campusmarket.marketplace.application.port.AiDescriptionPort;

@Component
@RequiredArgsConstructor
public class GroqAiAdapter implements AiDescriptionPort {

    private final GroqAiClient groqAiClient;

    @Override
    public String improveDescription(String description) {
        return groqAiClient.improveDescription(description);
    }

    @Override
    public String generateDescription(String title, String category) {
        return groqAiClient.generateDescription(title, category);
    }

    @Override
    public String generateTitle(String description) {
        return groqAiClient.generateTitle(description);
    }

    @Override
    public String correctDescription(String description) {
        return groqAiClient.correctDescription(description);
    }

}