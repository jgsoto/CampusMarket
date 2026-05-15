package org.uce.campusmarket.identity.domain.valueobject;

public class FullName {

    private final String value;

    public FullName(String value) {

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Invalid full name");
        }

        this.value = value;
    }

    public String getValue() {
        return value;
    }
}