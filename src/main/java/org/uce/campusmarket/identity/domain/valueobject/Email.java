package org.uce.campusmarket.identity.domain.valueobject;

import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.regex.Pattern;

@Getter
public class Email {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@uce\\.edu\\.ec$");

    private final String value;

    public Email(String value) {

        if (value == null || !EMAIL_PATTERN.matcher(value).matches()) {
            throw new DomainException("El correo institucional no es válido");
        }

        this.value = value.toLowerCase();
    }

}