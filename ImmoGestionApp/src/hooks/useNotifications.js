// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

/**
 * Hook personnalisé pour gérer les notifications
 * Fournit les fonctionnalités de récupération, marquage et suppression des notifications
 * 
 * @param {number} userId - L'ID de l'utilisateur
 */
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charge toutes les notifications de l'utilisateur
   */
  const loadNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getNotificationsByUserId(userId);
      
      // ✅ CORRECTION : Adapter à la structure du backend
      setNotifications(data.notifications || []);
      setUnreadCount(data.statistiques?.nonLues || 0); // ← Changé ici
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError('Impossible de charger les notifications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Charge uniquement le nombre de notifications non lues (plus léger)
   */
  const loadUnreadCount = useCallback(async () => {
    if (!userId) return;

    try {
      const count = await notificationService.countNotificationsNonLues(userId);
      setUnreadCount(count);
    } catch (err) {
      console.error('Erreur lors du chargement du compteur:', err);
    }
  }, [userId]);

  /**
   * Marque une notification comme lue
   */
  const markAsRead = useCallback(async (notificationId) => {
    if (!userId) return;

    try {
      await notificationService.marquerCommeLue(notificationId, userId);
      
      // Mise à jour locale
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, lue: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Erreur lors du marquage de la notification:', err);
      throw err;
    }
  }, [userId]);

  /**
   * Marque toutes les notifications comme lues
   */
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      await notificationService.marquerToutesCommeLues(userId);
      
      // Mise à jour locale
      setNotifications(prev => prev.map(n => ({ ...n, lue: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications:', err);
      throw err;
    }
  }, [userId]);

  /**
   * Supprime une notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    if (!userId) return;

    try {
      await notificationService.supprimerNotification(notificationId, userId);
      
      // Mise à jour locale
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      // Décrémenter le compteur si la notification était non lue
      if (notificationToDelete && !notificationToDelete.lue) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
      throw err;
    }
  }, [userId, notifications]);

  /**
   * Rafraîchit les notifications
   */
  const refresh = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Chargement initial des notifications
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Polling toutes les 30 secondes pour les nouvelles notifications
  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [userId, loadUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
}