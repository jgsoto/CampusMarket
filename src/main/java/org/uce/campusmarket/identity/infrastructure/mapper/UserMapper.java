package org.uce.campusmarket.identity.infrastructure.mapper;

import org.springframework.stereotype.Component;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.infrastructure.persistence.UserJpaEntity;

@Component
public class UserMapper {

    public UserJpaEntity toEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserJpaEntity.builder()
                .id(user.getId())
                .clerkId(user.getClerkId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .trustScore(user.getTrustScore())
                .phone(user.getPhone())
                .address(user.getAddress())
                .description(user.getDescription())
                .socialMedia(user.getSocialMedia())
                .photoUrl(user.getPhotoUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public User toDomain(UserJpaEntity entity) {
        if (entity == null) {
            return null;
        }

        return User.builder()
                .id(entity.getId())
                .clerkId(entity.getClerkId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .trustScore(entity.getTrustScore())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .description(entity.getDescription())
                .socialMedia(entity.getSocialMedia())
                .photoUrl(entity.getPhotoUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}