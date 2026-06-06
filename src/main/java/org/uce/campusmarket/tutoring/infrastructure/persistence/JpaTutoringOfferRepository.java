package org.uce.campusmarket.tutoring.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JpaTutoringOfferRepository extends JpaRepository<TutoringOfferJpaEntity, UUID> {
    List<TutoringOfferJpaEntity> findByTutorId(UUID tutorId);
}
