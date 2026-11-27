package com.finwise.finwise.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Account;
import com.finwise.finwise.entity.Category;
import com.finwise.finwise.entity.Transaction;
import com.finwise.finwise.entity.User;
import com.finwise.finwise.repo.AccountRepository;
import com.finwise.finwise.repo.CategoryRepository;
import com.finwise.finwise.repo.TransactionRepository;
import com.finwise.finwise.repo.UserRepository;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CategoryRepository categoryRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            AccountRepository accountRepository,
            CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
    }

    private User resolveDefaultUser() {
        return userRepository.findAll().stream().findFirst().orElseGet(() -> {
            User demo = new User();
            demo.setFullName("Alex Vance");
            demo.setEmail("demo@finintel.ai");
            demo.setPassword("$2a$10$wS8B/9C/7Yh2tL9D1rLg3.Oa8E8p8m4u4s6u8w0w2w4w6w8w0w2w4");
            return userRepository.save(demo);
        });
    }

    private Account resolveDefaultAccount(User user) {
        return accountRepository.findAll().stream().findFirst().orElseGet(() -> {
            Account acc = new Account();
            acc.setUser(user);
            acc.setAccountName("Primary Checking");
            acc.setAccountType("BANK");
            acc.setOpeningBalance(java.math.BigDecimal.valueOf(5000));
            return accountRepository.save(acc);
        });
    }

    private Category resolveDefaultCategory(User user, String categoryName) {
        String targetName = (categoryName != null && !categoryName.isBlank()) ? categoryName : "Shopping & Retail";
        return categoryRepository.findAll().stream()
                .filter(c -> c.getCategoryName() != null && c.getCategoryName().equalsIgnoreCase(targetName))
                .findFirst()
                .orElseGet(() -> {
                    Category cat = new Category();
                    cat.setUser(user);
                    cat.setCategoryName(targetName);
                    cat.setCategoryType("EXPENSE");
                    cat.setIsDefault(true);
                    return categoryRepository.save(cat);
                });
    }

    @Override
    public Transaction createTransaction(Transaction transaction) {
        User user = null;
        if (transaction.getUser() != null && transaction.getUser().getUserId() != null) {
            user = userRepository.findById(transaction.getUser().getUserId()).orElse(null);
        }
        if (user == null) {
            user = resolveDefaultUser();
        }
        transaction.setUser(user);

        // Resolve account: first check by ID, then check by accountName for this user, else default
        Account targetAccount = null;
        if (transaction.getAccount() != null) {
            if (transaction.getAccount().getAccountId() != null) {
                targetAccount = accountRepository.findById(transaction.getAccount().getAccountId()).orElse(null);
            } else if (transaction.getAccount().getAccountName() != null && !transaction.getAccount().getAccountName().isBlank()) {
                String accName = transaction.getAccount().getAccountName().trim();
                targetAccount = accountRepository.findByUser_UserId(user.getUserId()).stream()
                        .filter(a -> a.getAccountName() != null && a.getAccountName().equalsIgnoreCase(accName))
                        .findFirst()
                        .orElse(null);
                if (targetAccount == null) {
                    Account newAcc = new Account();
                    newAcc.setUser(user);
                    newAcc.setAccountName(accName);
                    newAcc.setAccountType("BANK");
                    newAcc.setOpeningBalance(java.math.BigDecimal.valueOf(1000));
                    targetAccount = accountRepository.save(newAcc);
                }
            }
        }
        if (targetAccount == null) {
            targetAccount = resolveDefaultAccount(user);
        }
        transaction.setAccount(targetAccount);

        // Update target account balance in database
        if (transaction.getAmount() != null) {
            java.math.BigDecimal curBalance = targetAccount.getOpeningBalance() != null ? targetAccount.getOpeningBalance() : java.math.BigDecimal.ZERO;
            if ("INCOME".equalsIgnoreCase(transaction.getTransactionType())) {
                targetAccount.setOpeningBalance(curBalance.add(transaction.getAmount()));
            } else {
                targetAccount.setOpeningBalance(curBalance.subtract(transaction.getAmount()));
            }
            accountRepository.save(targetAccount);
        }

        if (transaction.getCategory() == null || transaction.getCategory().getCategoryId() == null) {
            String catName = transaction.getCategory() != null ? transaction.getCategory().getCategoryName() : null;
            transaction.setCategory(resolveDefaultCategory(user, catName));
        }
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDate.now());
        }
        return transactionRepository.save(transaction);
    }

    @Override
    public Transaction getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found with ID: " + transactionId));
    }

    @Override
    public List<Transaction> getAllTransactionsByUser(Long userId) {
        return transactionRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Transaction> getTransactionsByType(Long userId, String transactionType) {
        return transactionRepository.findByUser_UserIdAndTransactionType(userId, transactionType);
    }

    @Override
    public Transaction updateTransaction(Long transactionId, Transaction updatedTransaction) {
        Transaction existingTransaction = getTransactionById(transactionId);
        existingTransaction.setTransactionType(updatedTransaction.getTransactionType());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setDescription(updatedTransaction.getDescription());
        existingTransaction.setPaymentMethod(updatedTransaction.getPaymentMethod());
        existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        if (updatedTransaction.getCategory() != null) {
            existingTransaction.setCategory(updatedTransaction.getCategory());
        }
        if (updatedTransaction.getAccount() != null) {
            existingTransaction.setAccount(updatedTransaction.getAccount());
        }
        return transactionRepository.save(existingTransaction);
    }

    @Override
    public void deleteTransaction(Long transactionId) {
        Transaction existingTransaction = getTransactionById(transactionId);
        if (existingTransaction.getAccount() != null && existingTransaction.getAmount() != null) {
            Account acc = existingTransaction.getAccount();
            java.math.BigDecimal cur = acc.getOpeningBalance() != null ? acc.getOpeningBalance() : java.math.BigDecimal.ZERO;
            if ("INCOME".equalsIgnoreCase(existingTransaction.getTransactionType())) {
                acc.setOpeningBalance(cur.subtract(existingTransaction.getAmount()));
            } else {
                acc.setOpeningBalance(cur.add(existingTransaction.getAmount()));
            }
            accountRepository.save(acc);
        }
        transactionRepository.delete(existingTransaction);
    }
}
