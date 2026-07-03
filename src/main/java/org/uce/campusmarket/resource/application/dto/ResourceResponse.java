package org.uce.campusmarket.resource.application.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ResourceResponse {
    private UUID id;
    private UUID ownerId;
    private String title;
    private String description;
    private String category;
    private LocalDateTime createdAt;
    private List<ResourceFileResponse> files;
    
    private String ownerName;
    private String ownerEmail;
}
