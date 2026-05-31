package org.uce.campusmarket.identity.domain.valueobject;

import java.util.regex.Pattern;

public class Email {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@uce\\.edu\\.ec$");

    private final String value;

    public Email(String value) {

        if (!EMAIL_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("Invalid university email");
        }

        this.value = value;
    }

    public String getValue() {
        return value;
    }
}