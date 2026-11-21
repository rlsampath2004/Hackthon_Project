package com.finwise.finwise.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.finwise.finwise.entity.Notification;
import com.finwise.finwise.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create notification
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Notification notification) {

        Notification savedNotification =
                notificationService.createNotification(notification);

        return ResponseEntity.ok(savedNotification);
    }

    // Get all notifications by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getAllNotificationsByUser(
            @PathVariable Long userId) {

        List<Notification> notifications =
                notificationService.getAllNotificationsByUser(userId);

        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId) {

        List<Notification> notifications =
                notificationService.getUnreadNotifications(userId);

        return ResponseEntity.ok(notifications);
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long notificationId) {

        Notification notification =
                notificationService.markAsRead(notificationId);

        return ResponseEntity.ok(notification);
    }

    // Delete notification
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId) {

        notificationService.deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }
}