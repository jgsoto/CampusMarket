package org.uce.campusmarket.identity.application.port;

import org.springframework.web.multipart.MultipartFile;

public interface ProfileImageStoragePort {

    String upload(MultipartFile file);

    void delete(String publicUrl);

}