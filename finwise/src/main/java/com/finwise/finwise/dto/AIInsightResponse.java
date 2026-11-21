package com.finwise.finwise.dto;

import java.time.LocalDateTime;

public class AIInsightResponse {

    private Long insightId;
    private String insightType;
    private String title;
    private String description;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public AIInsightResponse() {}

    public Long getInsightId() { return insightId; }
    public void setInsightId(Long insightId) { this.insightId = insightId; }

    public String getInsightType() { return insightType; }
    public void setInsightType(String insightType) { this.insightType = insightType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}