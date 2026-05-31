package org.uce.campusmarket.marketplace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListingRequest {
    private String title;
    private String description;
    private double price;
    private List<MultipartFile> images;
}
