package com.finwise.finwise.service;

import java.time.LocalDate;
import java.util.List;

import com.finwise.finwise.entity.Budget;

public interface BudgetService {

    Budget createBudget(Budget budget);

    Budget getBudgetById(Long budgetId);

    List<Budget> getAllBudgetsByUser(Long userId);

    List<Budget> getBudgetsByMonth(Long userId, LocalDate budgetMonth);

    Budget updateBudget(Long budgetId, Budget budget);

    void deleteBudget(Long budgetId);

}