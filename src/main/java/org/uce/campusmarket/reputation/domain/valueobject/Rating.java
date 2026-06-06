package org.uce.campusmarket.reputation.domain.valueobject;

import lombok.Getter;
import org.uce.campusmarket.shared.exception.DomainException;

@Getter
public class Rating {

    private final int value;

    public Rating(int value) {

        if (value < 1 || value > 5) {
            throw new DomainException(
                    "La calificación debe estar entre 1 y 5"
            );
        }

        this.value = value;
    }

}