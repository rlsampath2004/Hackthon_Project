package com.finwise.finwise.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finwise.finwise.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_UserId(Long userId);

    List<Notification> findByUser_UserIdAndIsRead(
            Long userId, Boolean isRead);

}