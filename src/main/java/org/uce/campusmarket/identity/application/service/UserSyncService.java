package org.uce.campusmarket.identity.application.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.uce.campusmarket.identity.domain.model.User;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class UserSyncService {

        private final UserRepository userRepository;

        public User synchronizeUser(
                        String clerkUserId,
                        String fullName,
                        String email) {

                return userRepository.findByClerkId(clerkUserId)
                                .orElseGet(() -> createUser(
                                                clerkUserId,
                                                fullName,
                                                email));
        }

        private User createUser(
                        String clerkUserId,
                        String fullName,
                        String email) {

                User user = User.create(
                                clerkUserId,
                                fullName,
                                email,
                                100.0);

                return userRepository.save(user);
        }
}