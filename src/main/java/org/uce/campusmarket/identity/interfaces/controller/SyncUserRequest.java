package org.uce.campusmarket.identity.interfaces.controller;

public record SyncUserRequest(

        String clerkUserId,

        String fullName,

        String email

) {
}