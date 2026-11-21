package com.finwise.finwise.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Transaction;
import com.finwise.finwise.repo.TransactionRepository;

@Service
public class SmartMoneyPlannerServiceImpl
        implements SmartMoneyPlannerService {

    private final TransactionRepository transactionRepository;

    public SmartMoneyPlannerServiceImpl(
            TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    private BigDecimal calculateTotal(Long userId, String type) {

        List<Transaction> transactions =
                transactionRepository.findByUser_UserIdAndTransactionType(
                        userId, type);

        return transactions.stream()
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Map<String, Object> generateMoneyPlan(Long userId) {

        BigDecimal income = calculateTotal(userId, "INCOME");
        BigDecimal expenses = calculateTotal(userId, "EXPENSE");
        BigDecimal savings = income.subtract(expenses);

        Map<String, Object> plan = new HashMap<>();

        plan.put("userId", userId);
        plan.put("totalIncome", income);
        plan.put("totalExpenses", expenses);
        plan.put("availableSavings", savings);

        if (income.compareTo(BigDecimal.ZERO) > 0) {
            plan.put("suggestion",
                    savings.compareTo(BigDecimal.ZERO) > 0
                    ? "Continue saving regularly."
                    : "Reduce unnecessary expenses to improve savings.");
        } else {
            plan.put("suggestion",
                    "Add income transactions to generate a money plan.");
        }

        return plan;
    }

    @Override
    public Map<String, Object> getSavingsRecommendations(Long userId) {

        BigDecimal income = calculateTotal(userId, "INCOME");
        BigDecimal expenses = calculateTotal(userId, "EXPENSE");
        BigDecimal savings = income.subtract(expenses);

        BigDecimal recommendedSavings =
                income.multiply(new BigDecimal("0.20"));

        Map<String, Object> recommendations = new HashMap<>();

        recommendations.put("totalIncome", income);
        recommendations.put("totalExpenses", expenses);
        recommendations.put("currentSavings", savings);
        recommendations.put("recommendedSavings", recommendedSavings);
        recommendations.put("message",
                "Try saving 20% of your income regularly.");

        return recommendations;
    }

    @Override
    public Map<String, Object> getBudgetRecommendations(Long userId) {

        BigDecimal income = calculateTotal(userId, "INCOME");
        BigDecimal recommendedBudget =
                income.multiply(new BigDecimal("0.50"));

        Map<String, Object> recommendations = new HashMap<>();

        recommendations.put("totalIncome", income);
        recommendations.put("recommendedExpenseBudget", recommendedBudget);
        recommendations.put("message",
                "Try limiting expenses to 50% of your income.");

        return recommendations;
    }
}