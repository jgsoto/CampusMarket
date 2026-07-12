package org.uce.campusmarket.tutoring.application.usecase;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;

import org.uce.campusmarket.tutoring.application.dto.TutoringOfferResponse;
import org.uce.campusmarket.tutoring.domain.model.TutoringStatus;
import org.uce.campusmarket.tutoring.domain.repository.TutoringOfferRepository;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BrowseTutoringOffersUseCase {

    private final TutoringOfferRepository repository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public List<TutoringOfferResponse> execute() {

        Map<UUID, User> tutorCache = new HashMap<>();
        Map<UUID, Double> ratingCache = new HashMap<>();
        Map<UUID, Integer> reviewCountCache = new HashMap<>();

        return repository.findAll()
                .stream()
                .filter(offer ->
                        offer.getStatus() == TutoringStatus.ACTIVE ||
                                offer.getStatus() == TutoringStatus.CLOSED
                )
                .map(offer -> {

                    UUID tutorId = offer.getTutorId();

                    User tutor = tutorCache.computeIfAbsent(
                            tutorId,
                            id -> userRepository.findById(id).orElse(null)
                    );

                    Double averageRating = ratingCache.computeIfAbsent(
                            tutorId,
                            reviewRepository::getAverageRatingByReviewedUserId
                    );

                    Integer totalReviews = reviewCountCache.computeIfAbsent(
                            tutorId,
                            reviewRepository::countByReviewedUserId
                    );

                    return new TutoringOfferResponse(
                            offer.getId(),
                            offer.getTutorId(),
                            offer.getSubject(),
                            offer.getDescription(),
                            offer.getHourlyRate().getValue().doubleValue(),
                            offer.getStatus().name(),
                            offer.getCreatedAt(),

                            tutor != null
                                    ? tutor.getFullName()
                                    : "Desconocido",

                            tutor != null
                                    ? tutor.getEmail()
                                    : "No disponible",

                            tutor != null
                                    ? tutor.getPhone()
                                    : "No disponible",

                            tutor != null
                                    ? tutor.getAddress()
                                    : "No disponible",

                            tutor != null
                                    ? tutor.getSocialMedia()
                                    : "No disponible",

                            averageRating,
                            totalReviews,

                            tutor != null
                                    ? tutor.getPhotoUrl()
                                    : null
                    );
                })
                .collect(Collectors.toList());
    }
}