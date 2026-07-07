package org.uce.campusmarket.marketplace.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.marketplace.application.dto.AiRequest;
import org.uce.campusmarket.marketplace.application.dto.AiResponse;
import org.uce.campusmarket.marketplace.application.usecase.GenerateListingTitleUseCase;
import org.uce.campusmarket.marketplace.application.usecase.ImproveListingDescriptionUseCase;
import org.uce.campusmarket.marketplace.application.usecase.CorrectListingTextUseCase;

@RestController
@RequestMapping("/api/listings/ai")
@RequiredArgsConstructor
public class AiController {

    private final ImproveListingDescriptionUseCase improveDescriptionUseCase;
    private final GenerateListingTitleUseCase generateTitleUseCase;
    private final CorrectListingTextUseCase correctTextUseCase;

    @PostMapping("/improve-description")
    public ResponseEntity<AiResponse> improveDescription(
            @RequestBody AiRequest request) {

        return ResponseEntity.ok(
                improveDescriptionUseCase.execute(request)
        );
    }

    @PostMapping("/generate-title")
    public ResponseEntity<AiResponse> generateTitle(
            @RequestBody AiRequest request) {

        return ResponseEntity.ok(
                generateTitleUseCase.execute(request)
        );
    }

    @PostMapping("/correct-text")
    public ResponseEntity<AiResponse> correctText(
            @RequestBody AiRequest request) {

        return ResponseEntity.ok(
                correctTextUseCase.execute(request)
        );
    }

}