package org.uce.campusmarket.resource.domain.model;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.uce.campusmarket.shared.exception.DomainException;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ResourceFile {

    private UUID id;
    private String url;
    private String filename;
    private String fileType;
    private Long size;

    public ResourceFile(UUID id, String url, String filename, String fileType, Long size) {
        if (url == null || url.isBlank()) {
            throw new DomainException("La URL del archivo es obligatoria");
        }
        if (filename == null || filename.isBlank()) {
            throw new DomainException("El nombre del archivo es obligatorio");
        }

        this.id = id != null ? id : UUID.randomUUID();
        this.url = url.trim();
        this.filename = filename.trim();
        this.fileType = fileType != null ? fileType.trim().toLowerCase() : "unknown";
        this.size = size != null ? size : 0L;
    }
}
