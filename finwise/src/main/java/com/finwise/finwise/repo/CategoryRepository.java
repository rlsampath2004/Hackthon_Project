package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByUser_UserId(Long userId);

    @Query("SELECT c FROM Category c WHERE c.categoryType = :type " +
           "AND (c.user.userId = :userId OR c.user IS NULL)")
    List<Category> findAvailableCategories(
            @Param("userId") Long userId,
            @Param("type") String categoryType);

}