package com.finwise.finwise.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.MonthlySummary;

@Repository
public interface MonthlySummaryRepository
        extends JpaRepository<MonthlySummary, Long> {

    List<MonthlySummary> findByUser_UserId(Long userId);

    Optional<MonthlySummary> findByUser_UserIdAndMonthAndYear(
            Long userId, Integer month, Integer year);
}