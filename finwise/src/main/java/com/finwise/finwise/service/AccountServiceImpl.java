package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Account;
import com.finwise.finwise.repo.AccountRepository;
import com.finwise.finwise.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;

    public AccountServiceImpl(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() ->
                    new RuntimeException("Account not found with ID: " + accountId));
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