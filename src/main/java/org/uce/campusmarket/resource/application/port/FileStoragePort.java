package org.uce.campusmarket.resource.application.port;

import org.springframework.web.multipart.MultipartFile;

public interface FileStoragePort {
    
    String upload(MultipartFile file);
    
    void delete(String fileUrl);
}
