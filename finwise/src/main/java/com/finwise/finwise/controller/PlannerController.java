package com.finwise.finwise.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.service.SmartMoneyPlannerService;

@RestController
@RequestMapping("/api/planner")
public class PlannerController {

    private final SmartMoneyPlannerService plannerService;

    public PlannerController(SmartMoneyPlannerService plannerService) {
        this.plannerService = plannerService;
    }

    // Generate money plan
    @GetMapping("/money-plan/{userId}")
    public ResponseEntity<Map<String, Object>> generateMoneyPlan(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                plannerService.generateMoneyPlan(userId));
    }

    // Get savings recommendations
    @GetMapping("/savings-recommendations/{userId}")
    public ResponseEntity<Map<String, Object>> getSavingsRecommendations(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                plannerService.getSavingsRecommendations(userId));
    }

    // Get budget recommendations
    @GetMapping("/budget-recommendations/{userId}")
    public ResponseEntity<Map<String, Object>> getBudgetRecommendations(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                plannerService.getBudgetRecommendations(userId));
    }
}