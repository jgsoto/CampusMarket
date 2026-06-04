package org.uce.campusmarket.identity.application.dto;

public record SyncUserRequest(

        String clerkUserId,

        String fullName,

        String email

) {
}