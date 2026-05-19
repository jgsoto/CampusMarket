package org.uce.campusmarket.marketplace.infrastructure.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.uce.campusmarket.shared.exception.DomainException;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.bucket}")
    private String bucket;

    @Value("${supabase.key}")
    private String supabaseKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String upload(MultipartFile file) {

        try {

            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

            String uploadUrl =
                    supabaseUrl +
                            "/storage/v1/object/" +
                            bucket +
                            "/" +
                            fileName;

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.parseMediaType(
                    file.getContentType()
            ));

            headers.setBearerAuth(supabaseKey);

            headers.set("apikey", supabaseKey);

            HttpEntity<byte[]> entity = new HttpEntity<>(
                    file.getBytes(),
                    headers
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new DomainException(
                        "Error al subir imagen a Supabase"
                );
            }

            return supabaseUrl +
                    "/storage/v1/object/public/" +
                    bucket +
                    "/" +
                    fileName;

        } catch (IOException e) {

            throw new DomainException(
                    "No se pudo procesar la imagen"
            );
        }
    }
}
