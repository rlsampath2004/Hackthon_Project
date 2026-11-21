package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.Account;
import com.finwise.finwise.repo.AccountRepository;
import com.finwise.finwise.service.AccountService;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;
    private final AccountRepository accountRepository;

    public AccountController(AccountService accountService, AccountRepository accountRepository) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
    }

    // Get all accounts (or filter by user)
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts(
            @RequestParam(required = false) Long userId) {
        if (userId != null) {
            return ResponseEntity.ok(accountService.getAllAccountsByUser(userId));
        }
        return ResponseEntity.ok(accountRepository.findAll());
    }

    // Create Account
    @PostMapping
    public ResponseEntity<Account> createAccount(
            @RequestBody Account account) {
        Account savedAccount = accountService.createAccount(account);
        return ResponseEntity.ok(savedAccount);
    }

    // Get Account By ID
    @GetMapping("/{accountId}")
    public ResponseEntity<Account> getAccountById(
            @PathVariable Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    // Get All Accounts By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getAllAccountsByUser(
            @PathVariable Long userId) {
        List<Account> accounts = accountService.getAllAccountsByUser(userId);
        return ResponseEntity.ok(accounts);
    }

    // Update Account
    @PutMapping("/{accountId}")
    public ResponseEntity<Account> updateAccount(
            @PathVariable Long accountId,
            @RequestBody Account updatedAccount) {
        Account account = accountService.updateAccount(accountId, updatedAccount);
        return ResponseEntity.ok(account);
    }

    // Delete Account
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
    }
}
