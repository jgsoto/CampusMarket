package org.uce.campusmarket.marketplace.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.marketplace.application.dto.AiRequest;
import org.uce.campusmarket.marketplace.application.dto.AiResponse;
import org.uce.campusmarket.marketplace.application.usecase.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/listings/ai")
@RequiredArgsConstructor
public class AiController {

    private final ImproveListingDescriptionUseCase improveDescriptionUseCase;
    private final GenerateListingTitleUseCase generateTitleUseCase;
    private final CorrectListingTextUseCase correctTextUseCase;
    private final GenerateDescriptionFromImageUseCase generateDescriptionFromImageUseCase;
    private final UploadAiImageUseCase uploadAiImageUseCase;

    @PostMapping("/improve-description")
    public ResponseEntity<AiResponse> improveDescription(@RequestBody AiRequest request) {

        return ResponseEntity.ok(improveDescriptionUseCase.execute(request));
    }

    @PostMapping("/generate-title")
    public ResponseEntity<AiResponse> generateTitle(@RequestBody AiRequest request) {

        return ResponseEntity.ok(generateTitleUseCase.execute(request));
    }

    @PostMapping("/correct-text")
    public ResponseEntity<AiResponse> correctText(@RequestBody AiRequest request) {

        return ResponseEntity.ok(correctTextUseCase.execute(request));
    }

    @PostMapping("/generate-from-image")
    public ResponseEntity<AiResponse> generateFromImage(@RequestBody AiRequest request) {

        return ResponseEntity.ok(generateDescriptionFromImageUseCase.execute(request));
    }

    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile image) {

        String imageUrl = uploadAiImageUseCase.execute(image);

        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }

}