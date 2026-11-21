package com.finwise.finwise.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.AIInsight;
import com.finwise.finwise.service.AIService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    // AI Transaction Categorizer
    @PostMapping("/categorize")
    public ResponseEntity<Map<String, Object>> predictCategory(@RequestBody Map<String, String> request) {
        String memo = request.getOrDefault("memo", "").toLowerCase();
        String category = "Shopping & Retail";
        String confidence = "92%";

        if (memo.contains("uber") || memo.contains("lyft") || memo.contains("fuel") || memo.contains("flight") || memo.contains("gas")) {
            category = "Transportation";
            confidence = "99%";
        } else if (memo.contains("starbucks") || memo.contains("coffee") || memo.contains("dine") || memo.contains("food") || memo.contains("restaurant")) {
            category = "Food & Dining";
            confidence = "99%";
        } else if (memo.contains("walmart") || memo.contains("grocery") || memo.contains("market") || memo.contains("trader") || memo.contains("costco")) {
            category = "Groceries";
            confidence = "98%";
        } else if (memo.contains("rent") || memo.contains("apartment") || memo.contains("housing") || memo.contains("lease")) {
            category = "Housing & Rent";
            confidence = "99%";
        } else if (memo.contains("netflix") || memo.contains("spotify") || memo.contains("movie") || memo.contains("cinema") || memo.contains("game")) {
            category = "Entertainment";
            confidence = "98%";
        } else if (memo.contains("wifi") || memo.contains("electric") || memo.contains("water") || memo.contains("utility")) {
            category = "Utilities & Wifi";
            confidence = "98%";
        } else if (memo.contains("salary") || memo.contains("payroll") || memo.contains("consulting") || memo.contains("stripe")) {
            category = "Salary / Employment";
            confidence = "99%";
        }

        return ResponseEntity.ok(Map.of(
            "category", category,
            "confidence", confidence,
            "isAiTagged", true
        ));
    }

    // 50/30/20 Rule Budget Recommendations
    @GetMapping("/recommendations/50-30-20")
    public ResponseEntity<Map<String, Object>> get503020Recommendations() {
        return ResponseEntity.ok(Map.of(
            "needsRatio", 0.50,
            "wantsRatio", 0.30,
            "savingsRatio", 0.20,
            "description", "50% Needs, 30% Wants, 20% Savings & Debt Repayment"
        ));
    }

    // Create AI insight
    @PostMapping("/insights")
    public ResponseEntity<AIInsight> createAIInsight(@RequestBody AIInsight aiInsight) {
        AIInsight savedInsight = aiService.createAIInsight(aiInsight);
        return ResponseEntity.ok(savedInsight);
    }

    // Get AI insight by ID
    @GetMapping("/insights/{insightId}")
    public ResponseEntity<AIInsight> getAIInsightById(@PathVariable Long insightId) {
        AIInsight insight = aiService.getAIInsightById(insightId);
        return ResponseEntity.ok(insight);
    }

    // Get all insights by user
    @GetMapping("/insights/user/{userId}")
    public ResponseEntity<List<AIInsight>> getAllInsightsByUser(@PathVariable Long userId) {
        List<AIInsight> insights = aiService.getAllInsightsByUser(userId);
        return ResponseEntity.ok(insights);
    }
}
