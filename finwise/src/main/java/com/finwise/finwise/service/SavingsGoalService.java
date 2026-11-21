package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.SavingsGoal;
import com.finwise.finwise.entity.SavingsGoal.GoalStatus;

public interface SavingsGoalService {

    // Create Savings Goal
    SavingsGoal createSavingsGoal(SavingsGoal savingsGoal);

    // Get Savings Goal By ID
    SavingsGoal getSavingsGoalById(Long goalId);

    // Get All Savings Goals By User
    List<SavingsGoal> getAllSavingsGoalsByUser(Long userId);

    // Get Savings Goals By Status
    List<SavingsGoal> getSavingsGoalsByStatus(
            Long userId, GoalStatus status);

    // Update Savings Goal
    SavingsGoal updateSavingsGoal(
            Long goalId, SavingsGoal updatedGoal);

    // Delete Savings Goal
    void deleteSavingsGoal(Long goalId);
}