package com.finwise.finwise.service;

import java.util.Map;

public interface SmartMoneyPlannerService {

    Map<String, Object> generateMoneyPlan(Long userId);

    Map<String, Object> getSavingsRecommendations(Long userId);

    Map<String, Object> getBudgetRecommendations(Long userId);
}