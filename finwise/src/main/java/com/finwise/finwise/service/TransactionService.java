package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.Transaction;

public interface TransactionService {

    Transaction createTransaction(Transaction transaction);

    Transaction getTransactionById(Long transactionId);

    List<Transaction> getAllTransactionsByUser(Long userId);

    List<Transaction> getTransactionsByType(Long userId, String transactionType);

    Transaction updateTransaction(Long transactionId, Transaction transaction);

    void deleteTransaction(Long transactionId);

}