package com.finwise.finwise.controller;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/income/{userId}")
    public ResponseEntity<BigDecimal> getTotalIncome(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                analyticsService.getTotalIncome(userId));
    }

    @GetMapping("/expenses/{userId}")
    public ResponseEntity<BigDecimal> getTotalExpenses(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                analyticsService.getTotalExpenses(userId));
    }

    @GetMapping("/savings/{userId}")
    public ResponseEntity<BigDecimal> getTotalSavings(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                analyticsService.getTotalSavings(userId));
    }

    @GetMapping("/balance/{userId}")
    public ResponseEntity<BigDecimal> getBalance(
            @PathVariable Long userId) {
        return ResponseEntity.ok(
                analyticsService.getBalance(userId));
    }

    @GetMapping("/monthly/{userId}")
    public ResponseEntity<Map<String, Object>> getMonthlyAnalytics(
            @PathVariable Long userId,
            @RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(
                analyticsService.getMonthlyAnalytics(userId, month, year));
    }
}