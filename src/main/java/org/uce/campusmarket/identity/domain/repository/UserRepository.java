package org.uce.campusmarket.identity.domain.repository;

import org.uce.campusmarket.identity.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByClerkId(String clerkId);
}