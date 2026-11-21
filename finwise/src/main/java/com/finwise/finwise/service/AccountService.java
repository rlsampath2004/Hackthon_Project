package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.Account;

public interface AccountService {

    Account createAccount(Account account);

    Account getAccountById(Long accountId);

    List<Account> getAllAccountsByUser(Long userId);

    Account updateAccount(Long accountId, Account account);

    void deleteAccount(Long accountId);

}