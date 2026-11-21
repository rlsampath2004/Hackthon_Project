package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.SavingsGoal;
import com.finwise.finwise.entity.SavingsGoal.GoalStatus;
import com.finwise.finwise.service.SavingsGoalService;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(
            SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    // Create savings goal
    @PostMapping
    public ResponseEntity<SavingsGoal> createSavingsGoal(
            @RequestBody SavingsGoal savingsGoal) {

        SavingsGoal savedGoal =
                savingsGoalService.createSavingsGoal(savingsGoal);

        return ResponseEntity.ok(savedGoal);
    }

    // Get savings goal by ID
    @GetMapping("/{goalId}")
    public ResponseEntity<SavingsGoal> getSavingsGoalById(
            @PathVariable Long goalId) {

        SavingsGoal goal =
                savingsGoalService.getSavingsGoalById(goalId);

        return ResponseEntity.ok(goal);
    }

    // Get all savings goals by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavingsGoal>> getAllSavingsGoalsByUser(
            @PathVariable Long userId) {

        List<SavingsGoal> goals =
                savingsGoalService.getAllSavingsGoalsByUser(userId);

        return ResponseEntity.ok(goals);
    }

    // Get savings goals by status
    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<SavingsGoal>> getSavingsGoalsByStatus(
            @PathVariable Long userId,
            @PathVariable GoalStatus status) {

        List<SavingsGoal> goals =
                savingsGoalService.getSavingsGoalsByStatus(userId, status);

        return ResponseEntity.ok(goals);
    }

    // Update savings goal
    @PutMapping("/{goalId}")
    public ResponseEntity<SavingsGoal> updateSavingsGoal(
            @PathVariable Long goalId,
            @RequestBody SavingsGoal updatedGoal) {

        SavingsGoal goal =
                savingsGoalService.updateSavingsGoal(goalId, updatedGoal);

        return ResponseEntity.ok(goal);
    }

    // Delete savings goal
    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteSavingsGoal(
            @PathVariable Long goalId) {

        savingsGoalService.deleteSavingsGoal(goalId);

        return ResponseEntity.noContent().build();
    }
}