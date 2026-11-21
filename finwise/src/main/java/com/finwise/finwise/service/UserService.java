package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.User;

public interface UserService {

    User getUserById(Long userId);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    User updateUser(Long userId, User user);

}