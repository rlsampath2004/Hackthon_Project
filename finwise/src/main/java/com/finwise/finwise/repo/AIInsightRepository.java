package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.AIInsight;

@Repository
public interface AIInsightRepository extends JpaRepository<AIInsight, Long> {

    List<AIInsight> findByUser_UserId(Long userId);

    List<AIInsight> findByUser_UserIdAndInsightType(
            Long userId, String insightType);

}