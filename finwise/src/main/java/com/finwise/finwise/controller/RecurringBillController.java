package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.RecurringBill;
import com.finwise.finwise.service.RecurringBillService;

@RestController
@RequestMapping("/api/recurring-bills")
public class RecurringBillController {

    private final RecurringBillService recurringBillService;

    public RecurringBillController(
            RecurringBillService recurringBillService) {
        this.recurringBillService = recurringBillService;
    }

    // Create recurring bill
    @PostMapping
    public ResponseEntity<RecurringBill> createRecurringBill(
            @RequestBody RecurringBill recurringBill) {

        RecurringBill savedBill =
                recurringBillService.createRecurringBill(recurringBill);

        return ResponseEntity.ok(savedBill);
    }

    // Get recurring bill by ID
    @GetMapping("/{billId}")
    public ResponseEntity<RecurringBill> getRecurringBillById(
            @PathVariable Long billId) {

        RecurringBill bill =
                recurringBillService.getRecurringBillById(billId);

        return ResponseEntity.ok(bill);
    }

    // Get all recurring bills by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecurringBill>> getAllRecurringBillsByUser(
            @PathVariable Long userId) {

        List<RecurringBill> bills =
                recurringBillService.getAllRecurringBillsByUser(userId);

        return ResponseEntity.ok(bills);
    }

    // Get active recurring bills
    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<RecurringBill>> getActiveRecurringBills(
            @PathVariable Long userId) {

        List<RecurringBill> bills =
                recurringBillService.getActiveRecurringBills(userId);

        return ResponseEntity.ok(bills);
    }

    // Update recurring bill
    @PutMapping("/{billId}")
    public ResponseEntity<RecurringBill> updateRecurringBill(
            @PathVariable Long billId,
            @RequestBody RecurringBill updatedBill) {

        RecurringBill bill =
                recurringBillService.updateRecurringBill(billId, updatedBill);

        return ResponseEntity.ok(bill);
    }

    // Delete recurring bill
    @DeleteMapping("/{billId}")
    public ResponseEntity<Void> deleteRecurringBill(
            @PathVariable Long billId) {

        recurringBillService.deleteRecurringBill(billId);

        return ResponseEntity.noContent().build();
    }
}