package org.uce.campusmarket.tutoring.interfaces.rest;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.uce.campusmarket.tutoring.application.dto.CreateTutoringOfferRequest;
import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;

import org.uce.campusmarket.tutoring.application.usecase.BrowseTutoringOffersUseCase;
import org.uce.campusmarket.tutoring.application.usecase.CloseTutoringOfferUseCase;
import org.uce.campusmarket.tutoring.application.usecase.CreateTutoringOfferUseCase;
import org.uce.campusmarket.tutoring.application.usecase.EnrollInTutoringUseCase;
import org.uce.campusmarket.tutoring.application.usecase.GetMyTutoringOffersUseCase;
import org.uce.campusmarket.tutoring.application.usecase.GetTutoringOfferUseCase;
import org.uce.campusmarket.tutoring.domain.repository.TutoringEnrollmentRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tutoring")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TutoringController {

    private final CreateTutoringOfferUseCase
            createTutoringOfferUseCase;

    private final BrowseTutoringOffersUseCase
            browseTutoringOffersUseCase;

    private final GetTutoringOfferUseCase
            getTutoringOfferUseCase;

    private final GetMyTutoringOffersUseCase
            getMyTutoringOffersUseCase;

    private final CloseTutoringOfferUseCase
            closeTutoringOfferUseCase;

    private final EnrollInTutoringUseCase
            enrollInTutoringUseCase;

    private final org.uce.campusmarket.tutoring.application.usecase.UpdateTutoringOfferUseCase
            updateTutoringOfferUseCase;

    private final org.uce.campusmarket.tutoring.application.usecase.DeleteTutoringOfferUseCase
            deleteTutoringOfferUseCase;

    private final TutoringEnrollmentRepository
            tutoringEnrollmentRepository;

    @PostMapping
    public ResponseEntity<TutoringOfferResponse>
    createOffer(

            @RequestBody
            CreateTutoringOfferRequest request,

            @RequestHeader("X-User-Id")
            UUID userId
    ) {

        request.setTutorId(userId);

        TutoringOfferResponse response =
                createTutoringOfferUseCase
                        .execute(request);

        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<List<TutoringOfferResponse>>
    browseOffers() {

        List<TutoringOfferResponse> response =
                browseTutoringOffersUseCase
                        .execute();

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{offerId}")
    public ResponseEntity<TutoringOfferResponse>
    getOfferDetails(
            @PathVariable UUID offerId
    ) {

        TutoringOfferResponse response =
                getTutoringOfferUseCase
                        .execute(offerId);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<List<TutoringOfferResponse>>
    getMyOffers(

            @RequestHeader("X-User-Id")
            UUID userId
    ) {

        List<TutoringOfferResponse> response =
                getMyTutoringOffersUseCase
                        .execute(userId);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/{offerId}/close")
    public ResponseEntity<Void>
    closeOffer(

            @PathVariable
            UUID offerId,

            @RequestHeader("X-User-Id")
            UUID requesterId
    ) {

        closeTutoringOfferUseCase
                .execute(
                        offerId,
                        requesterId
                );

        return ResponseEntity.ok()
                .build();
    }


    @PostMapping("/{offerId}/enroll")
    public ResponseEntity<Void>
    enroll(

            @PathVariable
            UUID offerId,

            @RequestHeader("X-User-Id")
            UUID studentId
    ) {

        enrollInTutoringUseCase
                .execute(
                        offerId,
                        studentId
                );

        return ResponseEntity.ok()
                .build();
    }

    @GetMapping("/{id}/enrolled")
    public ResponseEntity<Boolean> isEnrolled(
            @PathVariable UUID id,

            @RequestHeader("X-User-Id")
            UUID studentId
    ) {

        boolean enrolled =
                tutoringEnrollmentRepository
                        .findByTutoringOfferIdAndStudentId(
                                id,
                                studentId
                        )
                        .isPresent();

        return ResponseEntity.ok(enrolled);
    }

    @PutMapping("/{offerId}")
    public ResponseEntity<TutoringOfferResponse> updateOffer(
            @PathVariable UUID offerId,
            @RequestBody org.uce.campusmarket.tutoring.application.dto.UpdateTutoringOfferRequest request,
            @RequestHeader("X-User-Id") UUID requesterId
    ) {
        TutoringOfferResponse response = updateTutoringOfferUseCase.execute(offerId, request, requesterId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{offerId}")
    public ResponseEntity<Void> deleteOffer(
            @PathVariable UUID offerId,
            @RequestHeader("X-User-Id") UUID requesterId
    ) {
        deleteTutoringOfferUseCase.execute(offerId, requesterId);
        return ResponseEntity.ok().build();
    }
}