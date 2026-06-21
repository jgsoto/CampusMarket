package org.uce.campusmarket.identity.domain.repository;

import org.uce.campusmarket.identity.domain.model.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByClerkId(String clerkId);
}