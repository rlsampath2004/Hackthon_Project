package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Category;
import com.finwise.finwise.repo.CategoryRepository;
import com.finwise.finwise.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> getAllCategoriesByUser(Long userId) {
        return categoryRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Category> getCategoriesByType(Long userId, String categoryType) {
        return categoryRepository.findAvailableCategories(userId, categoryType);
    }

    @Override
    public Category updateCategory(Long categoryId, Category updatedCategory) {

        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                    new RuntimeException("Category not found with ID: " + categoryId));

        existingCategory.setCategoryName(updatedCategory.getCategoryName());
        existingCategory.setCategoryType(updatedCategory.getCategoryType());

        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long categoryId) {

        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                    new RuntimeException("Category not found with ID: " + categoryId));

        categoryRepository.delete(existingCategory);
    }
}