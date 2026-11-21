package com.finwise.finwise.service;

import java.util.List;
import com.finwise.finwise.entity.MonthlySummary;

public interface MonthlySummaryService {

    // Create Monthly Summary
    MonthlySummary createMonthlySummary(MonthlySummary summary);

    // Get Monthly Summary By ID
    MonthlySummary getMonthlySummaryById(Long summaryId);

    // Get All Monthly Summaries By User
    List<MonthlySummary> getAllMonthlySummariesByUser(Long userId);

    // Get Summary By User, Month and Year
    MonthlySummary getMonthlySummaryByUserAndMonthAndYear(
            Long userId, Integer month, Integer year);

    // Update Monthly Summary
    MonthlySummary updateMonthlySummary(
            Long summaryId, MonthlySummary updatedSummary);

    // Delete Monthly Summary
    void deleteMonthlySummary(Long summaryId);
}