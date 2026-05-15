package org.uce.campusmarket.identity.domain.exception;

public class InvalidEmailException extends RuntimeException {

    public InvalidEmailException() {
        super("Invalid university email");
    }
}