package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.MonthlySummary;
import com.finwise.finwise.service.MonthlySummaryService;

@RestController
@RequestMapping("/api/monthly-summaries")
public class MonthlySummaryController {

    private final MonthlySummaryService monthlySummaryService;

    public MonthlySummaryController(
            MonthlySummaryService monthlySummaryService) {
        this.monthlySummaryService = monthlySummaryService;
    }

    // Create monthly summary
    @PostMapping
    public ResponseEntity<MonthlySummary> createMonthlySummary(
            @RequestBody MonthlySummary summary) {

        MonthlySummary savedSummary =
                monthlySummaryService.createMonthlySummary(summary);

        return ResponseEntity.ok(savedSummary);
    }

    // Get monthly summary by ID
    @GetMapping("/{summaryId}")
    public ResponseEntity<MonthlySummary> getMonthlySummaryById(
            @PathVariable Long summaryId) {

        MonthlySummary summary =
                monthlySummaryService.getMonthlySummaryById(summaryId);

        return ResponseEntity.ok(summary);
    }

    // Get all monthly summaries by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MonthlySummary>> getAllMonthlySummariesByUser(
            @PathVariable Long userId) {

        List<MonthlySummary> summaries =
                monthlySummaryService.getAllMonthlySummariesByUser(userId);

        return ResponseEntity.ok(summaries);
    }

    // Get summary by user, month and year
    @GetMapping("/user/{userId}/month/{month}/year/{year}")
    public ResponseEntity<MonthlySummary> getMonthlySummaryByUserAndMonthAndYear(
            @PathVariable Long userId,
            @PathVariable Integer month,
            @PathVariable Integer year) {

        MonthlySummary summary =
                monthlySummaryService.getMonthlySummaryByUserAndMonthAndYear(
                        userId, month, year);

        return ResponseEntity.ok(summary);
    }

    // Update monthly summary
    @PutMapping("/{summaryId}")
    public ResponseEntity<MonthlySummary> updateMonthlySummary(
            @PathVariable Long summaryId,
            @RequestBody MonthlySummary updatedSummary) {

        MonthlySummary summary =
                monthlySummaryService.updateMonthlySummary(
                        summaryId, updatedSummary);

        return ResponseEntity.ok(summary);
    }

    // Delete monthly summary
    @DeleteMapping("/{summaryId}")
    public ResponseEntity<Void> deleteMonthlySummary(
            @PathVariable Long summaryId) {

        monthlySummaryService.deleteMonthlySummary(summaryId);

        return ResponseEntity.noContent().build();
    }
}