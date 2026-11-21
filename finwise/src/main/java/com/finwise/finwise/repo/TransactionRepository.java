package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser_UserId(Long userId);

    List<Transaction> findByTransactionType(String transactionType);

    List<Transaction> findByUser_UserIdAndTransactionType(
            Long userId, String transactionType);

}