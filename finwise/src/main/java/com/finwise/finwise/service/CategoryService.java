package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.Category;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    List<Category> getAllCategoriesByUser(Long userId);

    List<Category> getCategoriesByType(Long userId, String categoryType);

    Category updateCategory(Long categoryId, Category category);

    void deleteCategory(Long categoryId);

}