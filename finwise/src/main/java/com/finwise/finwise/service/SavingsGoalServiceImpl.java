package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.SavingsGoal;
import com.finwise.finwise.entity.SavingsGoal.GoalStatus;
import com.finwise.finwise.repo.SavingsGoalRepository;
import com.finwise.finwise.service.SavingsGoalService;

@Service
public class SavingsGoalServiceImpl implements SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;

    // Constructor Injection
    public SavingsGoalServiceImpl(
            SavingsGoalRepository savingsGoalRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
    }

    // Create Savings Goal
    @Override
    public SavingsGoal createSavingsGoal(SavingsGoal savingsGoal) {
        return savingsGoalRepository.save(savingsGoal);
    }

    // Get Savings Goal By ID
    @Override
    public SavingsGoal getSavingsGoalById(Long goalId) {
        return savingsGoalRepository.findById(goalId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Savings goal not found with ID: " + goalId));
    }

    // Get All Savings Goals By User
    @Override
    public List<SavingsGoal> getAllSavingsGoalsByUser(Long userId) {
        return savingsGoalRepository.findByUser_UserId(userId);
    }

    // Get Savings Goals By Status
    @Override
    public List<SavingsGoal> getSavingsGoalsByStatus(
            Long userId, GoalStatus status) {

        return savingsGoalRepository
                .findByUser_UserIdAndStatus(userId, status);
    }

    // Update Savings Goal
    @Override
    public SavingsGoal updateSavingsGoal(
            Long goalId, SavingsGoal updatedGoal) {

        SavingsGoal existingGoal = getSavingsGoalById(goalId);

        existingGoal.setGoalName(updatedGoal.getGoalName());
        existingGoal.setTargetAmount(updatedGoal.getTargetAmount());
        existingGoal.setCurrentAmount(updatedGoal.getCurrentAmount());
        existingGoal.setTargetDate(updatedGoal.getTargetDate());
        existingGoal.setStatus(updatedGoal.getStatus());

        return savingsGoalRepository.save(existingGoal);
    }

    // Delete Savings Goal
    @Override
    public void deleteSavingsGoal(Long goalId) {

        SavingsGoal existingGoal = getSavingsGoalById(goalId);

        savingsGoalRepository.delete(existingGoal);
    }
}