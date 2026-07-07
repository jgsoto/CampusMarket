package org.uce.campusmarket.marketplace.application.usecase;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.marketplace.application.port.ImageStoragePort;

@Service
@RequiredArgsConstructor
public class UploadAiImageUseCase {

    private final ImageStoragePort imageStoragePort;

    public String execute(MultipartFile image) {

        return imageStoragePort.upload(image);

    }

}