package org.uce.campusmarket.tutoring.domain.repository;

import org.uce.campusmarket.tutoring.domain.model.TutoringOffer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TutoringOfferRepository {
    TutoringOffer save(TutoringOffer tutoringOffer);
    Optional<TutoringOffer> findById(UUID id);
    List<TutoringOffer> findAll();
    List<TutoringOffer> findByTutorId(UUID tutorId);
    void deleteById(UUID id);
}
