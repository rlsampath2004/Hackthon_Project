package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.RecurringBill;

@Repository
public interface RecurringBillRepository extends JpaRepository<RecurringBill, Long> {

    List<RecurringBill> findByUser_UserId(Long userId);

    List<RecurringBill> findByUser_UserIdAndIsActive(
            Long userId, Boolean isActive);

}