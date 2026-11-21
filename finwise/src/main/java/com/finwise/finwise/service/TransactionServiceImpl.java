package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Transaction;
import com.finwise.finwise.repo.TransactionRepository;
import com.finwise.finwise.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() ->
                    new RuntimeException("Transaction not found with ID: " + transactionId));
    }

    @Override
    public List<Transaction> getAllTransactionsByUser(Long userId) {
        return transactionRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Transaction> getTransactionsByType(
            Long userId, String transactionType) {

        return transactionRepository
                .findByUser_UserIdAndTransactionType(userId, transactionType);
    }

    @Override
    public Transaction updateTransaction(
            Long transactionId, Transaction updatedTransaction) {

        Transaction existingTransaction = getTransactionById(transactionId);

        existingTransaction.setTransactionType(updatedTransaction.getTransactionType());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setDescription(updatedTransaction.getDescription());
        existingTransaction.setPaymentMethod(updatedTransaction.getPaymentMethod());
        existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        existingTransaction.setCategory(updatedTransaction.getCategory());
        existingTransaction.setAccount(updatedTransaction.getAccount());

        return transactionRepository.save(existingTransaction);
    }

    @Override
    public void deleteTransaction(Long transactionId) {
        Transaction existingTransaction = getTransactionById(transactionId);
        transactionRepository.delete(existingTransaction);
    }
}