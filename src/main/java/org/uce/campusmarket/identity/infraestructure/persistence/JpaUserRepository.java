package org.uce.campusmarket.identity.infraestructure.persistence;

import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaUserRepository extends JpaRepository<User, UUID>, UserRepository {

    Optional<User> findByEmail(String email);

    Optional<User> findByClerkId(String clerkId);
}