package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.Category;
import com.finwise.finwise.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    // Constructor injection
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Create Category
    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category) {

        Category savedCategory = categoryService.createCategory(category);

        return ResponseEntity.ok(savedCategory);
    }

    // Get All Categories By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Category>> getAllCategoriesByUser(
            @PathVariable Long userId) {

        List<Category> categories =
                categoryService.getAllCategoriesByUser(userId);

        return ResponseEntity.ok(categories);
    }

    // Get Categories By Type
    @GetMapping("/user/{userId}/type/{categoryType}")
    public ResponseEntity<List<Category>> getCategoriesByType(
            @PathVariable Long userId,
            @PathVariable String categoryType) {

        List<Category> categories =
                categoryService.getCategoriesByType(userId, categoryType);

        return ResponseEntity.ok(categories);
    }

    // Update Category
    @PutMapping("/{categoryId}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long categoryId,
            @RequestBody Category updatedCategory) {

        Category category = categoryService.updateCategory(
                categoryId, updatedCategory);

        return ResponseEntity.ok(category);
    }

    // Delete Category
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId) {

        categoryService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }
}