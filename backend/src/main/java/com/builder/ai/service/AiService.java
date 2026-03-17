package com.builder.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
@Service
public class AiService {

    @Value("${}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, String> generatePage(String description) {
        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        String prompt = "You are an expert Frontend Developer and UI/UX Designer. You need to create a complete, stunning, and modern UI based on the following description: '" + description + "'. " +
                "You MUST return your response as a valid JSON object ONLY, with exactly three keys: 'html', 'css', and 'js'.\n\n" +
                "DESIGN REQUIREMENTS:\n" +
                "- Use Tailwind CSS utility classes extensively for styling.\n" +
                "- Ensure the design is highly responsive. Use flexbox or CSS grid for modern layouts.\n" +
                "- Implement generous padding, margins, and whitespace (`p-4 md:p-8`, `gap-4`). Things should NOT look cramped.\n" +
                "- Use a beautiful, modern color palette (e.g., slate/gray for text, vibrant indigo/blue/violet for primary actions).\n" +
                "- Use soft shadows (`shadow-md`, `shadow-lg`, `shadow-xl`) to create depth and elevation.\n" +
                "- Use rounded corners (`rounded-xl`, `rounded-2xl`) for a friendly, contemporary feel.\n" +
                "- Include subtle interactive hover states (e.g., `hover:-translate-y-1`, `hover:shadow-lg`, `transition-all duration-300`) on buttons and cards.\n" +
                "- Ensure accessibility by using proper contrast and semantic HTML tags (header, main, section, nav).\n" +
                "- Add beautiful gradients where appropriate (`bg-gradient-to-r`).\n\n" +
                "DATA STRUCTURE REQUIREMENTS:\n" +
                "- 'html': The HTML markup (do NOT include <html>, <head>, or <body> tags, just the inner content). Do NOT put any <style> or <script> tags here. Ensure inputs have 'name' attributes for form submission.\n" +
                "- 'css': Add any custom CSS animations or keyframes here if needed. Otherwise, keep it empty or minimal.\n" +
                "- 'js': Pure Vanilla JavaScript. Use document.querySelector to bind events if needed.\n\n" +
                "IMPORTANT: Return ONLY the raw JSON string. Do not use Markdown wrapping like ```json or ```.";

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> part = new HashMap<>();
        part.put("parts", new Object[]{textPart});

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", new Object[]{part});

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                String aiTextResponse = candidates.get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .path("text")
                        .asText();
                
                aiTextResponse = aiTextResponse.trim();
                if (aiTextResponse.startsWith("```json")) {
                    aiTextResponse = aiTextResponse.substring(7);
                }
                if (aiTextResponse.startsWith("```")) {
                    aiTextResponse = aiTextResponse.substring(3);
                }
                if (aiTextResponse.endsWith("```")) {
                    aiTextResponse = aiTextResponse.substring(0, aiTextResponse.length() - 3);
                }
                
                JsonNode parsedContent = objectMapper.readTree(aiTextResponse.trim());
                
                Map<String, String> result = new HashMap<>();
                result.put("html", parsedContent.path("html").asText(""));
                result.put("css", parsedContent.path("css").asText(""));
                result.put("js", parsedContent.path("js").asText(""));
                return result;
            }
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error calling Gemini API or Parsing JSON: " + e.getMessage());
        }

        return Map.of(
            "html", "<div><h2>Error generating content. Please check logs.</h2></div>",
            "css", "",
            "js", ""
        );
    }
}
