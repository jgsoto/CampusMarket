package org.uce.campusmarket.marketplace.infrastructure.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
@RequiredArgsConstructor
public class GroqAiClient {

    private static final String URL = "https://api.groq.com/openai/v1/chat/completions";

    private final RestTemplate restTemplate;

    @Qualifier("groqApiKey")
    private final String apiKey;

    public String improveDescription(String description) {

        String prompt = """
                Eres un experto en marketing para un marketplace universitario.

                Reescribe la siguiente descripción para que sea:

                - Profesional.
                - Clara.
                - Atractiva.
                - Fácil de leer.
                - Sin inventar información.
                - Sin agregar datos que el usuario no escribió.
                - Conserva exactamente el mismo producto.

                Devuelve únicamente la nueva descripción.

                Descripción:
                %s
                """.formatted(description);

        return executePrompt(prompt);

    }

    public String generateDescription(String title, String category) {

        String prompt = """
                Eres un experto en ventas para un marketplace universitario.

                A partir del siguiente título genera una descripción:

                Reglas:

                - Máximo 120 palabras.
                - Profesional.
                - Clara.
                - Atractiva.
                - No inventes especificaciones técnicas.
                - No agregues características que no estén implícitas.
                - No inventes accesorios.
                - No uses emojis.
                - Devuelve únicamente la descripción.

                Producto:

                %s
                """.formatted(title);

        return executePrompt(prompt);

    }

    public String generateTitle(String description) {

        String prompt = """
                Eres un experto redactando títulos para publicaciones.

                A partir de la siguiente descripción genera un título.

                Reglas:

                - Máximo 12 palabras.
                - Claro.
                - Profesional.
                - Atractivo.
                - Sin emojis.
                - Sin comillas.
                - Devuelve únicamente el título.

                Descripción:

                %s
                """.formatted(description);

        return executePrompt(prompt);

    }

    public String correctDescription(String description) {

        String prompt = """
                Corrige la ortografía y gramática del siguiente texto.

                Reglas:

                - No cambies el significado.
                - No agregues información.
                - No elimines información.
                - Solo corrige errores ortográficos y de redacción.
                - Devuelve únicamente el texto corregido.

                Texto:

                %s
                """.formatted(description);

        return executePrompt(prompt);

    }

    public String generateDescriptionFromImage(String imageUrl) {

        String prompt = """
            Observa la imagen del producto.

            Genera una descripción para publicarla en un marketplace universitario.

            Reglas:

            - Describe únicamente lo que realmente observas.
            - No inventes características técnicas.
            - No inventes estado si no es visible.
            - Usa un tono profesional.
            - Máximo 120 palabras.
            - Devuelve únicamente la descripción.
            """;

        GroqVisionRequest request = new GroqVisionRequest(
                "meta-llama/llama-4-scout-17b-16e-instruct",
                List.of(
                        new GroqVisionRequest.Message(
                                "user",
                                List.of(
                                        new GroqVisionRequest.TextContent(
                                                "text",
                                                prompt
                                        ),
                                        new GroqVisionRequest.ImageContent(
                                                "image_url",
                                                new GroqVisionRequest.ImageUrl(imageUrl)
                                        )
                                )
                        )
                ),
                0.5
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<GroqVisionRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<GroqResponse> response =
                restTemplate.exchange(
                        URL,
                        HttpMethod.POST,
                        entity,
                        GroqResponse.class
                );

        if (response.getBody() == null
                || response.getBody().getChoices() == null
                || response.getBody().getChoices().isEmpty()) {

            throw new RuntimeException("Groq returned an empty response.");
        }

        return response.getBody()
                .getChoices()
                .get(0)
                .getMessage()
                .getContent()
                .trim();
    }

    private String executePrompt(String prompt) {

        GroqRequest request = new GroqRequest(
                "llama-3.3-70b-versatile",
                List.of(
                        new GroqRequest.Message(
                                "user",
                                prompt
                        )
                ),
                0.7
        );

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_JSON);

        headers.setBearerAuth(apiKey);

        HttpEntity<GroqRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<GroqResponse> response =
                restTemplate.exchange(
                        URL,
                        HttpMethod.POST,
                        entity,
                        GroqResponse.class
                );

        if (response.getBody() == null
                || response.getBody().getChoices() == null
                || response.getBody().getChoices().isEmpty()) {

            throw new RuntimeException("Groq returned an empty response.");
        }

        return response.getBody()
                .getChoices()
                .get(0)
                .getMessage()
                .getContent()
                .trim();

    }

}