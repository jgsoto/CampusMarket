package org.uce.campusmarket.tutoring.interfaces.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.tutoring.application.dto.CreateTutoringOfferRequest;
import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;
import org.uce.campusmarket.tutoring.application.usecase.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tutoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite llamadas desde el frontend local
public class TutoringController {

    private final CreateTutoringOfferUseCase createTutoringOfferUseCase;
    private final BrowseTutoringOffersUseCase browseTutoringOffersUseCase;
    private final GetTutoringOfferUseCase getTutoringOfferUseCase;
    private final GetMyTutoringOffersUseCase getMyTutoringOffersUseCase;
    private final CloseTutoringOfferUseCase closeTutoringOfferUseCase;

    @PostMapping
    public ResponseEntity<TutoringOfferResponse> createOffer(
            @RequestBody CreateTutoringOfferRequest request,
            @RequestHeader("X-User-Id") UUID userId
    ) {
        request.setTutorId(userId);
        TutoringOfferResponse response = createTutoringOfferUseCase.execute(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TutoringOfferResponse>> browseOffers() {
        List<TutoringOfferResponse> response = browseTutoringOffersUseCase.execute();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoringOfferResponse> getOfferDetails(@PathVariable UUID id) {
        TutoringOfferResponse response = getTutoringOfferUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<TutoringOfferResponse>> getMyOffers(
            @RequestHeader("X-User-Id") UUID userId
    ) {
        List<TutoringOfferResponse> response = getMyTutoringOffersUseCase.execute(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<Void> closeOffer(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID requesterId
    ) {
        closeTutoringOfferUseCase.execute(id, requesterId);
        return ResponseEntity.ok().build();
    }
}
