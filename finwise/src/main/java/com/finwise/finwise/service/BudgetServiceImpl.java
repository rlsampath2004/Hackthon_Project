package com.finwise.finwise.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Budget;
import com.finwise.finwise.entity.Category;
import com.finwise.finwise.entity.User;
import com.finwise.finwise.repo.BudgetRepository;
import com.finwise.finwise.repo.CategoryRepository;
import com.finwise.finwise.repo.UserRepository;

@Service
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public BudgetServiceImpl(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    private User resolveDefaultUser() {
        return userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User demo = new User();
            demo.setFullName("Alex Vance");
            demo.setEmail("demo@finintel.ai");
            demo.setPassword("$2a$10$wS8B/9C/7Yh2tL9D1rLg3.Oa8E8p8m4u4s6u8w0w2w4w6w8w0w2w4");
            return userRepository.save(demo);
        });
    }

    private Category resolveDefaultCategory(User user, String categoryName) {
        String targetName = (categoryName != null && !categoryName.isBlank()) ? categoryName : "Food & Dining";
        return categoryRepository.findAll().stream()
                .filter(c -> c.getCategoryName() != null && c.getCategoryName().equalsIgnoreCase(targetName))
                .findFirst()
                .orElseGet(() -> {
                    Category cat = new Category();
                    cat.setUser(user);
                    cat.setCategoryName(targetName);
                    cat.setCategoryType("EXPENSE");
                    cat.setIsDefault(true);
                    return categoryRepository.save(cat);
                });
    }

    @Override
    public Budget createBudget(Budget budget) {
        if (budget.getUser() == null || budget.getUser().getUserId() == null) {
            budget.setUser(resolveDefaultUser());
        } else {
            User u = userRepository.findById(budget.getUser().getUserId())
                    .orElseGet(this::resolveDefaultUser);
            budget.setUser(u);
        }
        if (budget.getCategory() == null || budget.getCategory().getCategoryId() == null) {
            String catName = budget.getCategory() != null ? budget.getCategory().getCategoryName() : null;
            budget.setCategory(resolveDefaultCategory(budget.getUser(), catName));
        }
        if (budget.getBudgetMonth() == null) {
            budget.setBudgetMonth(LocalDate.now().withDayOfMonth(1));
        }
        if (budget.getAlertThreshold() == null) {
            budget.setAlertThreshold(java.math.BigDecimal.valueOf(0.80));
        }

        // Upsert if budget for user and category already exists
        List<Budget> existingList = budgetRepository.findByUser_UserIdAndCategory_CategoryId(
                budget.getUser().getUserId(), budget.getCategory().getCategoryId());
        for (Budget b : existingList) {
            if (b.getBudgetMonth() != null && b.getBudgetMonth().equals(budget.getBudgetMonth())) {
                b.setMonthlyLimit(budget.getMonthlyLimit());
                b.setAlertThreshold(budget.getAlertThreshold());
                return budgetRepository.save(b);
            }
        }

        return budgetRepository.save(budget);
    }

    @Override
    public Budget getBudgetById(Long budgetId) {
        return budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found with ID: " + budgetId));
    }

    @Override
    public List<Budget> getAllBudgetsByUser(Long userId) {
        return budgetRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Budget> getBudgetsByMonth(Long userId, LocalDate budgetMonth) {
        return budgetRepository.findByUser_UserIdAndBudgetMonth(userId, budgetMonth);
    }

    @Override
    public Budget updateBudget(Long budgetId, Budget updatedBudget) {
        Budget existingBudget = getBudgetById(budgetId);
        existingBudget.setMonthlyLimit(updatedBudget.getMonthlyLimit());
        if (updatedBudget.getBudgetMonth() != null) {
            existingBudget.setBudgetMonth(updatedBudget.getBudgetMonth());
        }
        if (updatedBudget.getCategory() != null) {
            existingBudget.setCategory(updatedBudget.getCategory());
        }
        if (updatedBudget.getAlertThreshold() != null) {
            existingBudget.setAlertThreshold(updatedBudget.getAlertThreshold());
        }
        return budgetRepository.save(existingBudget);
    }

    @Override
    public void deleteBudget(Long budgetId) {
        Budget existingBudget = getBudgetById(budgetId);
        budgetRepository.delete(existingBudget);
    }
}
