package org.uce.campusmarket.tutoring.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JpaTutoringOfferRepository extends JpaRepository<TutoringOfferJpaEntity, UUID> {
    List<TutoringOfferJpaEntity> findByTutorId(UUID tutorId);
}
