package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.MonthlySummary;
import com.finwise.finwise.repo.MonthlySummaryRepository;
import com.finwise.finwise.service.MonthlySummaryService;

@Service
public class MonthlySummaryServiceImpl implements MonthlySummaryService {

    private final MonthlySummaryRepository monthlySummaryRepository;

    public MonthlySummaryServiceImpl(
            MonthlySummaryRepository monthlySummaryRepository) {
        this.monthlySummaryRepository = monthlySummaryRepository;
    }

    @Override
    public MonthlySummary createMonthlySummary(MonthlySummary summary) {
        return monthlySummaryRepository.save(summary);
    }

    @Override
    public MonthlySummary getMonthlySummaryById(Long summaryId) {
        return monthlySummaryRepository.findById(summaryId)
                .orElseThrow(() -> new RuntimeException(
                        "Monthly summary not found with ID: " + summaryId));
    }

    @Override
    public List<MonthlySummary> getAllMonthlySummariesByUser(Long userId) {
        return monthlySummaryRepository.findByUser_UserId(userId);
    }

    @Override
    public MonthlySummary getMonthlySummaryByUserAndMonthAndYear(
            Long userId, Integer month, Integer year) {

        return monthlySummaryRepository
                .findByUser_UserIdAndMonthAndYear(userId, month, year)
                .orElseThrow(() -> new RuntimeException(
                        "Monthly summary not found for the given user, month and year"));
    }

    @Override
    public MonthlySummary updateMonthlySummary(
            Long summaryId, MonthlySummary updatedSummary) {

        MonthlySummary existingSummary = getMonthlySummaryById(summaryId);

        existingSummary.setMonth(updatedSummary.getMonth());
        existingSummary.setYear(updatedSummary.getYear());
        existingSummary.setTotalIncome(updatedSummary.getTotalIncome());
        existingSummary.setTotalExpenses(updatedSummary.getTotalExpenses());
        existingSummary.setTotalSavings(updatedSummary.getTotalSavings());
        existingSummary.setBalance(updatedSummary.getBalance());
        existingSummary.setSummaryDate(updatedSummary.getSummaryDate());

        return monthlySummaryRepository.save(existingSummary);
    }

    @Override
    public void deleteMonthlySummary(Long summaryId) {
        MonthlySummary summary = getMonthlySummaryById(summaryId);
        monthlySummaryRepository.delete(summary);
    }
}