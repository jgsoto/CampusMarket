package org.uce.campusmarket.marketplace.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "listing_images")
@Getter
@Setter
@NoArgsConstructor
public class ListingImageJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private boolean thumbnail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private ListingJpaEntity listing;
}