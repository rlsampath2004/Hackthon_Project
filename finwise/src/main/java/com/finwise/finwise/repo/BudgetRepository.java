
package com.finwise.finwise.repo;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.Budget;

@Repository
public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    List<Budget> findByUser_UserId(Long userId);

    List<Budget> findByUser_UserIdAndBudgetMonth(
            Long userId, LocalDate budgetMonth);

    List<Budget> findByUser_UserIdAndCategory_CategoryId(
            Long userId, Long categoryId);
}
