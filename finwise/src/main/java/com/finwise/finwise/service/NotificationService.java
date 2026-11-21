package com.finwise.finwise.service;

import java.util.List;

import com.finwise.finwise.entity.Notification;

public interface NotificationService {

    Notification createNotification(Notification notification);

    List<Notification> getAllNotificationsByUser(Long userId);

    List<Notification> getUnreadNotifications(Long userId);

    Notification markAsRead(Long notificationId);

    void deleteNotification(Long notificationId);

}