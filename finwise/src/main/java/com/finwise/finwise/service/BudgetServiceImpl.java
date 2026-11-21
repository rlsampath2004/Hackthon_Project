package com.finwise.finwise.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Budget;
import com.finwise.finwise.repo.BudgetRepository;
import com.finwise.finwise.service.BudgetService;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetServiceImpl(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @Override
    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    @Override
    public Budget getBudgetById(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .orElseThrow(() ->
                    new RuntimeException("Budget not found with ID: " + budgetId));
    }

    @Override
    public List<Budget> getAllBudgetsByUser(Long userId) {
        return budgetRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Budget> getBudgetsByMonth(
            Long userId, LocalDate budgetMonth) {

        return budgetRepository
                .findByUser_UserIdAndBudgetMonth(userId, budgetMonth);
    }

    @Override
    public Budget updateBudget(Long budgetId, Budget updatedBudget) {

        Budget existingBudget = getBudgetById(budgetId);

        existingBudget.setMonthlyLimit(updatedBudget.getMonthlyLimit());
        existingBudget.setBudgetMonth(updatedBudget.getBudgetMonth());
        existingBudget.setCategory(updatedBudget.getCategory());

        return budgetRepository.save(existingBudget);
    }

    @Override
    public void deleteBudget(Long budgetId) {
        Budget existingBudget = getBudgetById(budgetId);
        budgetRepository.delete(existingBudget);
    }
}