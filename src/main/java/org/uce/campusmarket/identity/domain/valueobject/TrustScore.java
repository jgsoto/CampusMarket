package org.uce.campusmarket.identity.domain.valueobject;

public class TrustScore {

    private final Double value;

    public TrustScore(Double value) {

        if (value < 0 || value > 5) {
            throw new IllegalArgumentException("Invalid trust score");
        }

        this.value = value;
    }

    public Double getValue() {
        return value;
    }
}