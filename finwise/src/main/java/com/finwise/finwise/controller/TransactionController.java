package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.Transaction;
import com.finwise.finwise.repo.TransactionRepository;
import com.finwise.finwise.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionService transactionService, TransactionRepository transactionRepository) {
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
    }

    // Get all transactions (or filter by user or type)
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String transactionType) {
        if (userId != null && transactionType != null) {
            return ResponseEntity.ok(transactionService.getTransactionsByType(userId, transactionType));
        }
        if (userId != null) {
            return ResponseEntity.ok(transactionService.getAllTransactionsByUser(userId));
        }
        return ResponseEntity.ok(transactionRepository.findAll());
    }

    // Create transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    // Get transaction by ID
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long transactionId) {
        Transaction transaction = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transaction);
    }

    // Get all transactions by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getAllTransactionsByUser(
            @PathVariable Long userId) {
        List<Transaction> transactions = transactionService.getAllTransactionsByUser(userId);
        return ResponseEntity.ok(transactions);
    }

    // Get transactions by type
    @GetMapping("/user/{userId}/type/{transactionType}")
    public ResponseEntity<List<Transaction>> getTransactionsByType(
            @PathVariable Long userId,
            @PathVariable String transactionType) {
        List<Transaction> transactions = transactionService.getTransactionsByType(userId, transactionType);
        return ResponseEntity.ok(transactions);
    }

    // Update transaction
    @PutMapping("/{transactionId}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long transactionId,
            @RequestBody Transaction updatedTransaction) {
        Transaction transaction = transactionService.updateTransaction(transactionId, updatedTransaction);
        return ResponseEntity.ok(transaction);
    }

    // Delete transaction
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
}
