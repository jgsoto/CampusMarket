package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.marketplace.application.dto.AiRequest;
import org.uce.campusmarket.marketplace.application.dto.AiResponse;
import org.uce.campusmarket.marketplace.infrastructure.ai.GroqAiClient;

@Service
@RequiredArgsConstructor
public class ImproveListingDescriptionUseCase {

    private final GroqAiClient groqAiClient;

    public AiResponse execute(AiRequest request) {

        String result = groqAiClient.improveDescription(
                request.getText()
        );

        return new AiResponse(result);

    }

}