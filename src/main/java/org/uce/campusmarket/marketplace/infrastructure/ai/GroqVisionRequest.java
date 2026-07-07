package org.uce.campusmarket.marketplace.infrastructure.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroqVisionRequest {

    private String model;

    private List<Message> messages;

    private Double temperature;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {

        private String role;

        private List<Content> content;
    }

    public interface Content {
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TextContent implements Content {

        private String type;

        private String text;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageContent implements Content {

        private String type;

        private ImageUrl image_url;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageUrl {

        private String url;
    }

}