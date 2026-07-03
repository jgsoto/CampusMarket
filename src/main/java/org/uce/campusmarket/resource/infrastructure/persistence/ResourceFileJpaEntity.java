package org.uce.campusmarket.resource.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "resource_files")
@Getter
@Setter
@NoArgsConstructor
public class ResourceFileJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private Long size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private ResourceJpaEntity resource;
}
