package com.builder.ai.controller;

import com.builder.ai.models.Page;
import com.builder.ai.repository.PageRepository;
import com.builder.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/pages")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PageController {
    private final PageRepository pageRepository;
    private final AiService aiService;

    @PostMapping("/generate")
    public Page generatePage(@RequestBody Map<String, String> request) {
        String description = request.get("description");
        Map<String, String> generated = aiService.generatePage(description);
        
        Page page = new Page();
        page.setDescription(description);
        page.setHtml(generated.get("html"));
        page.setCss(generated.get("css"));
        page.setJs(generated.get("js"));
        return pageRepository.save(page);
    }

    @GetMapping("/{id}")
    public Page getPage(@PathVariable String id) {
        return pageRepository.findById(id).orElseThrow(() -> new RuntimeException("Page not found"));
    }
}
