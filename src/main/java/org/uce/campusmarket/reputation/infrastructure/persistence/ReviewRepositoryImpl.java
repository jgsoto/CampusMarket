package org.uce.campusmarket.reputation.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import org.uce.campusmarket.reputation.domain.model.Review;
import org.uce.campusmarket.reputation.domain.repository.ReviewRepository;
import org.uce.campusmarket.reputation.infrastructure.mapper.ReviewMapper;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewRepository {

    private final ReviewJpaRepository jpaRepository;

    private final ReviewMapper mapper;

    @Override
    public Review save(Review review) {

        ReviewJpaEntity entity =
                mapper.toEntity(review);

        ReviewJpaEntity saved =
                jpaRepository.save(entity);

        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Review> findById(UUID id) {

        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Review> findByReviewedUserId(
            UUID reviewedUserId
    ) {

        return jpaRepository
                .findByReviewedUserId(reviewedUserId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public boolean existsByReviewerIdAndTargetId(
            UUID reviewerId,
            UUID targetId
    ) {

        return jpaRepository
                .existsByReviewerIdAndTargetId(
                        reviewerId,
                        targetId
                );
    }

    @Override
    public double getAverageRatingByReviewedUserId(UUID reviewedUserId) {

        return jpaRepository
                .getAverageRatingByReviewedUserId(reviewedUserId);
    }

    @Override
    public int countByReviewedUserId(UUID reviewedUserId) {

        return jpaRepository
                .countByReviewedUserId(reviewedUserId);
    }

    @Override
    public void deleteById(UUID id) {

        jpaRepository.deleteById(id);
    }
}