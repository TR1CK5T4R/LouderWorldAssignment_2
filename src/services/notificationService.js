/**
 * notificationService.js
 * Handles fetching, updating, and interacting with user notifications.
 */
import axiosInstance from './axiosInstance';

/**
 * Fetch notifications for a specific user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getNotifications(userId) {
    if (!userId) return [];
    try {
        const { data } = await axiosInstance.get(`/api/notifications?userId=${encodeURIComponent(userId)}`);
        return data?.notifications || [];
    } catch (err) {
        console.warn('Failed to fetch notifications:', err);
        return [];
    }
}

/**
 * Mark a specific notification, or all notifications, as read.
 * @param {string} [notificationId] - Optional ID. If omitted, marks all as read.
 * @param {string} [userId] - Required if marking all as read.
 * @returns {Promise<boolean>}
 */
export async function markAsRead(notificationId, userId) {
    try {
        if (notificationId) {
            await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
        } else {
            if (!userId) throw new Error('userId required to mark all read');
            await axiosInstance.patch(`/api/notifications/read-all`, { userId });
        }
        return true;
    } catch (err) {
        console.warn('Failed to mark notifications as read:', err);
        return false;
    }
}
