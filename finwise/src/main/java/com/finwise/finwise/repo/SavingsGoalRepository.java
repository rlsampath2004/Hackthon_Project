package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finwise.finwise.entity.SavingsGoal;
import com.finwise.finwise.entity.SavingsGoal.GoalStatus;

public interface SavingsGoalRepository
        extends JpaRepository<SavingsGoal, Long> {

    // Find all savings goals by user ID
    List<SavingsGoal> findByUser_UserId(Long userId);

    // Find savings goals by user ID and status
    List<SavingsGoal> findByUser_UserIdAndStatus(
            Long userId, GoalStatus status);
}