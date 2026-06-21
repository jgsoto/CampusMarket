package org.uce.campusmarket.marketplace.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.uce.campusmarket.marketplace.application.dto.CreateListingRequest;
import org.uce.campusmarket.marketplace.application.dto.ListingResponse;
import org.uce.campusmarket.marketplace.application.dto.UpdateListingRequest;
import org.uce.campusmarket.marketplace.application.dto.CategoryResponse;
import org.uce.campusmarket.marketplace.application.usecase.BrowseListingsUseCase;
import org.uce.campusmarket.marketplace.application.usecase.CreateListingUseCase;
import org.uce.campusmarket.marketplace.application.usecase.DeleteListingUseCase;
import org.uce.campusmarket.marketplace.application.usecase.GetCategoriesUseCase;
import org.uce.campusmarket.marketplace.application.usecase.GetMyListingsUseCase;
import org.uce.campusmarket.marketplace.application.usecase.PublishListingUseCase;
import org.uce.campusmarket.marketplace.application.usecase.UpdateListingUseCase;
import org.uce.campusmarket.marketplace.application.usecase.GetListingUseCase;
import org.uce.campusmarket.marketplace.application.usecase.MarkListingAsSoldUseCase;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final CreateListingUseCase createListingUseCase;
    private final UpdateListingUseCase updateListingUseCase;
    private final BrowseListingsUseCase browseListingsUseCase;
    private final DeleteListingUseCase deleteListingUseCase;
    private final GetMyListingsUseCase getMyListingsUseCase;
    private final PublishListingUseCase publishListingUseCase;
    private final GetListingUseCase getListingUseCase;
    private final MarkListingAsSoldUseCase markListingAsSoldUseCase;
    private final GetCategoriesUseCase getCategoriesUseCase;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponse> createListing(
            @ModelAttribute CreateListingRequest request) {

        ListingResponse response = createListingUseCase.execute(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId,
            @ModelAttribute UpdateListingRequest request) {

        ListingResponse response = updateListingUseCase.execute(id, ownerId, request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ListingResponse>> browseListings() {

        List<ListingResponse> response = browseListingsUseCase.execute();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListing(@PathVariable UUID id) {
        ListingResponse response = getListingUseCase.execute(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ListingResponse>> getMyListings(
            @RequestHeader("X-User-Id") UUID ownerId) {

        List<ListingResponse> response = getMyListingsUseCase.execute(ownerId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId) {

        deleteListingUseCase.execute(id, ownerId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<Void> publishListing(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId) {

        publishListingUseCase.execute(id, ownerId);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mark-sold")
    public ResponseEntity<Void> markAsSold(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID ownerId) {
        markListingAsSoldUseCase.execute(id, ownerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> response = getCategoriesUseCase.execute();
        return ResponseEntity.ok(response);
    }

}