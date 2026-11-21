package com.finwise.finwise.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.finwise.finwise.entity.Notification;
import com.finwise.finwise.repo.NotificationRepository;
import com.finwise.finwise.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotificationsByUser(Long userId) {
        return notificationRepository.findByUser_UserId(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_UserIdAndIsRead(userId, false);
    }

    @Override
    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                    new RuntimeException("Notification not found with ID: " + notificationId));

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                    new RuntimeException("Notification not found with ID: " + notificationId));

        notificationRepository.delete(notification);
    }
}