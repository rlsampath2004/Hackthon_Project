package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Account;
import com.finwise.finwise.entity.User;
import com.finwise.finwise.repo.AccountRepository;
import com.finwise.finwise.repo.UserRepository;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    public AccountServiceImpl(AccountRepository accountRepository, UserRepository userRepository) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
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

    @Override
    public Account createAccount(Account account) {
        if (account.getUser() == null || account.getUser().getUserId() == null) {
            account.setUser(resolveDefaultUser());
        }
        return accountRepository.save(account);
    }

    @Override
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + accountId));
    }

    @Override
    public List<Account> getAllAccountsByUser(Long userId) {
        return accountRepository.findByUser_UserId(userId);
    }

    @Override
    public Account updateAccount(Long accountId, Account updatedAccount) {
        Account existingAccount = getAccountById(accountId);
        existingAccount.setAccountName(updatedAccount.getAccountName());
        existingAccount.setAccountType(updatedAccount.getAccountType());
        existingAccount.setOpeningBalance(updatedAccount.getOpeningBalance());
        return accountRepository.save(existingAccount);
    }

    @Override
    public void deleteAccount(Long accountId) {
        Account existingAccount = getAccountById(accountId);
        accountRepository.delete(existingAccount);
    }
}
