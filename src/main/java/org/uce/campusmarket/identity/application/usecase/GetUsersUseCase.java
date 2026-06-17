package org.uce.campusmarket.identity.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.uce.campusmarket.identity.application.dto.BasicUserResponse;
import org.uce.campusmarket.identity.domain.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetUsersUseCase {

    private final UserRepository userRepository;

    public List<BasicUserResponse> execute(List<UUID> ids) {
        return userRepository.findAllById(ids)
                .stream()
                .map(user -> new BasicUserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail()
                ))
                .toList();
    }
}