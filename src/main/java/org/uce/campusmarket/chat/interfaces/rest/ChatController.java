package org.uce.campusmarket.chat.interfaces.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.uce.campusmarket.chat.application.dto.*;
import org.uce.campusmarket.chat.application.usecase.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final CreateConversationUseCase createConversationUseCase;

    private final GetUserConversationsUseCase getUserConversationsUseCase;

    private final GetConversationMessagesUseCase getConversationMessagesUseCase;

    private final SendMessageUseCase sendMessageUseCase;

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponse> createConversation(
            @RequestBody CreateConversationRequest request,
            @RequestHeader("X-User-Id") UUID buyerId
    ) {

        return ResponseEntity.ok(
                createConversationUseCase.execute(
                        buyerId,
                        request
                )
        );
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> myConversations(
            @RequestHeader("X-User-Id") UUID userId
    ) {

        return ResponseEntity.ok(
                getUserConversationsUseCase.execute(userId)
        );
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponse>> messages(
            @PathVariable UUID conversationId
    ) {

        return ResponseEntity.ok(
                getConversationMessagesUseCase.execute(
                        conversationId
                )
        );
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable UUID conversationId,
            @RequestBody SendMessageRequest request,
            @RequestHeader("X-User-Id") UUID senderId
    ) {

        return ResponseEntity.ok(
                sendMessageUseCase.execute(
                        conversationId,
                        senderId,
                        request.content()
                )
        );
    }
}