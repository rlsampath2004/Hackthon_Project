package com.finwise.finwise.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.Budget;
import com.finwise.finwise.repo.BudgetRepository;
import com.finwise.finwise.service.BudgetService;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;
    private final BudgetRepository budgetRepository;

    public BudgetController(BudgetService budgetService, BudgetRepository budgetRepository) {
        this.budgetService = budgetService;
        this.budgetRepository = budgetRepository;
    }

    // Get all budgets (or filter by user)
    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String monthYear) {
        if (userId != null) {
            return ResponseEntity.ok(budgetService.getAllBudgetsByUser(userId));
        }
        return ResponseEntity.ok(budgetRepository.findAll());
    }

    // Create Budget
    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @RequestBody Budget budget) {
        Budget savedBudget = budgetService.createBudget(budget);
        return ResponseEntity.ok(savedBudget);
    }

    // Get Budget By ID
    @GetMapping("/{budgetId}")
    public ResponseEntity<Budget> getBudgetById(
            @PathVariable Long budgetId) {
        Budget budget = budgetService.getBudgetById(budgetId);
        return ResponseEntity.ok(budget);
    }

    // Get All Budgets By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getAllBudgetsByUser(
            @PathVariable Long userId) {
        List<Budget> budgets = budgetService.getAllBudgetsByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    // Get Budgets By Month
    @GetMapping("/user/{userId}/month")
    public ResponseEntity<List<Budget>> getBudgetsByMonth(
            @PathVariable Long userId,
            @RequestParam LocalDate budgetMonth) {
        List<Budget> budgets = budgetService.getBudgetsByMonth(userId, budgetMonth);
        return ResponseEntity.ok(budgets);
    }

    // Update Budget
    @PutMapping("/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long budgetId,
            @RequestBody Budget updatedBudget) {
        Budget budget = budgetService.updateBudget(budgetId, updatedBudget);
        return ResponseEntity.ok(budget);
    }

    // Delete Budget
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long budgetId) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.noContent().build();
    }
}
