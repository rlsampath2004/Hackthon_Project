package com.finwise.finwise.service;

import java.math.BigDecimal;
import java.util.Map;

public interface AnalyticsService {

    BigDecimal getTotalIncome(Long userId);

    BigDecimal getTotalExpenses(Long userId);

    BigDecimal getTotalSavings(Long userId);

    BigDecimal getBalance(Long userId);

    Map<String, Object> getMonthlyAnalytics(
            Long userId, Integer month, Integer year);
}