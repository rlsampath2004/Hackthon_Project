package com.finwise.finwise.dto;

import java.math.BigDecimal;

public class PlannerResponse {

    private Long userId;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal availableSavings;
    private String suggestion;

    public PlannerResponse() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getAvailableSavings() { return availableSavings; }
    public void setAvailableSavings(BigDecimal availableSavings) { this.availableSavings = availableSavings; }

    public String getSuggestion() { return suggestion; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
}