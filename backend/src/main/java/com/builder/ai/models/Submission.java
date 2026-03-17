package com.builder.ai.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;
    
    private String pageId;
    private Map<String, Object> formData;
    
    @CreatedDate
    private LocalDateTime submittedAt;
}
