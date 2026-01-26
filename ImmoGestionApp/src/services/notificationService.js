// src/services/notification.service.js

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Service pour gérer les notifications via l'API Spring Boot R2DBC
 * Compatible avec NotificationController du backend
 */
class NotificationService {
  
  /**
   * Récupère toutes les notifications d'un utilisateur avec statistiques
   * Endpoint: GET /api/notifications/user/{userId}
   * 
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<NotificationResponseDTO>} Notifications avec statistiques
   * 
   * Response: {
   *   notifications: NotificationDTO[],
   *   statistiques: { total, nonLues, lues, urgentes }
   * }
   */
  async getNotificationsByUserId(userId) {
    if (!userId) {
      throw new Error('userId est requis');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Aucune notification trouvée, retourner un objet vide
          return {
            notifications: [],
            statistiques: {
              total: 0,
              nonLues: 0,
              lues: 0,
              urgentes: 0
            }
          };
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Enrichir les notifications avec le temps relatif
      if (data.notifications) {
        data.notifications = data.notifications.map(notif => ({
          ...notif,
          tempsRelatif: this.getTempsRelatif(notif.createdAt)
        }));
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupère uniquement les notifications non lues
   * Endpoint: GET /api/notifications/user/{userId}/unread
   * 
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<NotificationDTO[]>} Liste des notifications non lues
   */
  async getNotificationsNonLues(userId) {
    if (!userId) {
      throw new Error('userId est requis');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userId}/unread`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return []; // Aucune notification non lue
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Enrichir avec le temps relatif
      return Array.isArray(data) 
        ? data.map(notif => ({
            ...notif,
            tempsRelatif: this.getTempsRelatif(notif.createdAt)
          }))
        : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications non lues:', error);
      throw error;
    }
  }

  /**
   * Compte le nombre de notifications non lues
   * Endpoint: GET /api/notifications/user/{userId}/unread/count
   * 
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<number>} Nombre de notifications non lues
   */
  async countNotificationsNonLues(userId) {
    if (!userId) {
      throw new Error('userId est requis');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userId}/unread/count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return 0;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const count = await response.json();
      return typeof count === 'number' ? count : 0;
    } catch (error) {
      console.error('❌ Erreur lors du comptage des notifications non lues:', error);
      throw error;
    }
  }

  /**
   * Marque une notification comme lue
   * Endpoint: PATCH /api/notifications/{notificationId}/read?userId={userId}
   * 
   * @param {number} notificationId - L'ID de la notification
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<NotificationDTO>} Notification mise à jour
   */
  async marquerCommeLue(notificationId, userId) {
    if (!notificationId || !userId) {
      throw new Error('notificationId et userId sont requis');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read?userId=${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Notification non trouvée');
        }
        if (response.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à modifier cette notification');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        tempsRelatif: this.getTempsRelatif(data.createdAt)
      };
    } catch (error) {
      console.error('❌ Erreur lors du marquage de la notification comme lue:', error);
      throw error;
    }
  }

  /**
   * Marque toutes les notifications comme lues
   * Endpoint: PATCH /api/notifications/user/{userId}/read-all
   * 
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<number>} Nombre de notifications marquées comme lues
   */
  async marquerToutesCommeLues(userId) {
    if (!userId) {
      throw new Error('userId est requis');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/user/${userId}/read-all`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const count = await response.json();
      return typeof count === 'number' ? count : 0;
    } catch (error) {
      console.error('❌ Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  /**
   * Supprime une notification
   * Endpoint: DELETE /api/notifications/{notificationId}?userId={userId}
   * 
   * @param {number} notificationId - L'ID de la notification
   * @param {number} userId - L'ID de l'utilisateur
   * @returns {Promise<void>}
   */
  async supprimerNotification(notificationId, userId) {
    if (!notificationId || !userId) {
      throw new Error('notificationId et userId sont requis');
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}?userId=${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Notification non trouvée');
        }
        if (response.status === 403) {
          throw new Error('Vous n\'êtes pas autorisé à supprimer cette notification');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle notification (utilisé principalement pour les tests)
   * Endpoint: POST /api/notifications
   * 
   * Note: En production, les notifications sont générées automatiquement
   * par NotificationGeneratorService lors d'événements métier
   * 
   * @param {CreateNotificationDTO} notificationData - Les données de la notification
   * @returns {Promise<NotificationDTO>} Notification créée
   */
  async creerNotification(notificationData) {
    try {
      // Validation
      if (!notificationData.userId) {
        throw new Error('userId est requis');
      }
      if (!notificationData.type) {
        throw new Error('type est requis');
      }
      if (!notificationData.titre) {
        throw new Error('titre est requis');
      }
      if (!notificationData.message) {
        throw new Error('message est requis');
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        ...data,
        tempsRelatif: this.getTempsRelatif(data.createdAt)
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  // ========== UTILITAIRES ==========

  /**
   * Calcule le temps relatif depuis la création de la notification
   * @param {string} createdAt - Date de création (ISO string)
   * @returns {string} Temps relatif (ex: "Il y a 5 minutes")
   */
  getTempsRelatif(createdAt) {
    if (!createdAt) return '';

    try {
      const now = new Date();
      const created = new Date(createdAt);
      const diffMs = now - created;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSeconds < 60) {
        return 'À l\'instant';
      } else if (diffMinutes < 60) {
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      } else if (diffHours < 24) {
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else if (diffDays < 7) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else {
        return created.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error('Erreur lors du calcul du temps relatif:', error);
      return '';
    }
  }

  /**
   * Filtre les notifications par type
   * @param {NotificationDTO[]} notifications - Liste des notifications
   * @param {string} type - Type de notification
   * @returns {NotificationDTO[]} Notifications filtrées
   */
  filterByType(notifications, type) {
    if (!type || type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  }

  /**
   * Filtre les notifications urgentes
   * @param {NotificationDTO[]} notifications - Liste des notifications
   * @returns {NotificationDTO[]} Notifications urgentes
   */
  filterUrgentes(notifications) {
    return notifications.filter(n => n.urgente);
  }

  /**
   * Trie les notifications
   * @param {NotificationDTO[]} notifications - Liste des notifications
   * @param {string} sortBy - Critère de tri ('date', 'type', 'urgence')
   * @param {string} order - Ordre ('asc', 'desc')
   * @returns {NotificationDTO[]} Notifications triées
   */
  sortNotifications(notifications, sortBy = 'date', order = 'desc') {
    return [...notifications].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        case 'type':
          comparison = (a.type || '').localeCompare(b.type || '');
          break;
        case 'urgence':
          comparison = (a.urgente ? 1 : 0) - (b.urgente ? 1 : 0);
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Types de notifications disponibles
   */
  TYPE_NOTIFICATION = {
    PAIEMENT: 'PAIEMENT',
    MAINTENANCE: 'MAINTENANCE',
    PROPRIETAIRE: 'PROPRIETAIRE',
    BIEN: 'BIEN',
    LOCATION: 'LOCATION',
    EXPULSION: 'EXPULSION',
  };

  /**
   * Configuration des icônes par type
   */
  getIconConfig(type) {
    const config = {
      PAIEMENT: {
        icon: 'CreditCard',
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10',
      },
      MAINTENANCE: {
        icon: 'Wrench',
        color: 'text-orange-600',
        bgColor: 'bg-orange-500/10',
      },
      PROPRIETAIRE: {
        icon: 'Users',
        color: 'text-green-600',
        bgColor: 'bg-green-500/10',
      },
      BIEN: {
        icon: 'Home',
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10',
      },
      LOCATION: {
        icon: 'FileText',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-500/10',
      },
      EXPULSION: {
        icon: 'AlertTriangle',
        color: 'text-red-600',
        bgColor: 'bg-red-500/10',
      },
    };

    return config[type] || {
      icon: 'Bell',
      color: 'text-gray-600',
      bgColor: 'bg-gray-500/10',
    };
  }
}

// Export d'une instance unique (Singleton)
export default new NotificationService();