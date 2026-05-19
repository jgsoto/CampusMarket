package org.uce.campusmarket.marketplace.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListingImageResponse {

    private String url;
    private boolean thumbnail;
}