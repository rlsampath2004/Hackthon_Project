package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.AIInsight;
import com.finwise.finwise.repo.AIInsightRepository;
import com.finwise.finwise.service.AIService;

@Service
public class AIServiceImpl implements AIService {

    private final AIInsightRepository aiInsightRepository;

    public AIServiceImpl(AIInsightRepository aiInsightRepository) {
        this.aiInsightRepository = aiInsightRepository;
    }

    @Override
    public AIInsight createAIInsight(AIInsight aiInsight) {
        return aiInsightRepository.save(aiInsight);
    }

    @Override
    public AIInsight getAIInsightById(Long insightId) {
        return aiInsightRepository.findById(insightId)
                .orElseThrow(() -> new RuntimeException(
                        "AI Insight not found with ID: " + insightId));
    }

    @Override
    public List<AIInsight> getAllInsightsByUser(Long userId) {
        return aiInsightRepository.findByUser_UserId(userId);
    }

    @Override
    public List<AIInsight> getInsightsByType(
            Long userId, String insightType) {
        return aiInsightRepository
                .findByUser_UserIdAndInsightType(userId, insightType);
    }

    @Override
    public AIInsight markAsRead(Long insightId) {
        AIInsight insight = getAIInsightById(insightId);
        insight.setIsRead(true);
        return aiInsightRepository.save(insight);
    }

    @Override
    public void deleteAIInsight(Long insightId) {
        AIInsight insight = getAIInsightById(insightId);
        aiInsightRepository.delete(insight);
    }
}