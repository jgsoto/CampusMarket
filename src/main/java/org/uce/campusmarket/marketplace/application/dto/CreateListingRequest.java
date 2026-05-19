package org.uce.campusmarket.marketplace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateListingRequest {

    private String title;

    private String description;

    private double price;

    private UUID categoryId;

    private UUID ownerId;

    private boolean publish;

    private List<MultipartFile> images;
}