package com.builder.ai.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "pages")
public class Page {
    @Id
    private String id;
    
    private String description;
    private String html;
    private String css;
    private String js;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
