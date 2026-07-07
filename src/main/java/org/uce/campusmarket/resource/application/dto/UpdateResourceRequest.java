package org.uce.campusmarket.resource.application.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class UpdateResourceRequest {
    private UUID resourceId;
    private String title;
    private String description;
    private String category;
    
    private List<MultipartFile> newFiles;
    private List<UUID> filesToDelete;
}
