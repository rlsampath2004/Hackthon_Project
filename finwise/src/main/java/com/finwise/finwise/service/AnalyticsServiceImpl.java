package com.finwise.finwise.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Transaction;
import com.finwise.finwise.repo.TransactionRepository;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TransactionRepository transactionRepository;

    public AnalyticsServiceImpl(
            TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    private List<Transaction> getTransactions(Long userId) {
        return transactionRepository.findByUser_UserId(userId);
    }

    @Override
    public BigDecimal getTotalIncome(Long userId) {
        return calculateTotal(userId, "INCOME");
    }

    @Override
    public BigDecimal getTotalExpenses(Long userId) {
        return calculateTotal(userId, "EXPENSE");
    }

    private BigDecimal calculateTotal(Long userId, String type) {
        return getTransactions(userId).stream()
                .filter(t -> type.equalsIgnoreCase(t.getTransactionType()))
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public BigDecimal getTotalSavings(Long userId) {
        return getTotalIncome(userId).subtract(getTotalExpenses(userId));
    }

    @Override
    public BigDecimal getBalance(Long userId) {
        return getTotalSavings(userId);
    }

    @Override
    public Map<String, Object> getMonthlyAnalytics(
            Long userId, Integer month, Integer year) {

        List<Transaction> monthlyTransactions = getTransactions(userId)
                .stream()
                .filter(t -> t.getTransactionDate() != null)
                .filter(t -> t.getTransactionDate().getMonthValue() == month)
                .filter(t -> t.getTransactionDate().getYear() == year)
                .toList();

        BigDecimal income = monthlyTransactions.stream()
                .filter(t -> "INCOME".equalsIgnoreCase(t.getTransactionType()))
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenses = monthlyTransactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getTransactionType()))
                .map(Transaction::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("month", month);
        analytics.put("year", year);
        analytics.put("totalIncome", income);
        analytics.put("totalExpenses", expenses);
        analytics.put("totalSavings", income.subtract(expenses));

        return analytics;
    }
}