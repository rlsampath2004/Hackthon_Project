package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.AIInsight;

public interface AIService {

    // Create AI Insight
    AIInsight createAIInsight(AIInsight aiInsight);

    // Get AI Insight By ID
    AIInsight getAIInsightById(Long insightId);

    // Get All AI Insights By User
    List<AIInsight> getAllInsightsByUser(Long userId);

    // Get AI Insights By Type
    List<AIInsight> getInsightsByType(
            Long userId, String insightType);

    // Mark AI Insight As Read
    AIInsight markAsRead(Long insightId);

    // Delete AI Insight
    void deleteAIInsight(Long insightId);
}