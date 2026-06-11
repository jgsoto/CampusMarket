package org.uce.campusmarket.marketplace.application.port;

import org.springframework.web.multipart.MultipartFile;

public interface ImageStoragePort {

    String upload(MultipartFile file);

    void delete(String publicUrl);
}
