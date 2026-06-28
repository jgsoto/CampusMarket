package org.uce.campusmarket.resource.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceFileResponse {
    private UUID id;
    private String url;
    private String filename;
    private String fileType;
    private Long size;
}
