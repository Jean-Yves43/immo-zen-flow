// src/contexts/Authcontext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../features/auth/api/authService';

const AuthContext = createContext(null);

// Définition des rôles et leurs routes
export const ROLES = {
  ADMIN: 'ADMIN',
  PROPRIETAIRE: 'PROPRIETAIRE',
  GESTIONNAIRE: 'GESTIONNAIRE',
  LOCATAIRE: 'LOCATAIRE',
  USER: 'USER',
};

// Mapping des rôles vers leurs dashboards
export const ROLE_ROUTES = {
  ADMIN: '/admin',
  PROPRIETAIRE: '/owner',
  GESTIONNAIRE: '/manager',
  LOCATAIRE: '/tenant',
  USER: '/',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  /**
   * Obtenir la route du dashboard selon le rôle
   */
  const getDashboardRoute = (roleLibelle) => {
    return ROLE_ROUTES[roleLibelle] || '/';
  };

  /**
   * Connexion
   */
  const login = async (identifier, password) => {
    try {
      const userData = await authService.login(identifier, password);
      setUser(userData);
      return {
        ...userData,
        dashboardRoute: getDashboardRoute(userData.roleLibelle),
      };
    } catch (error) {
      throw error;
    }
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  /**
   * Mise à jour des données utilisateur
   */
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (roleLibelle) => {
    return user?.roleLibelle === roleLibelle;
  };

  /**
   * Vérifie si l'utilisateur a l'un des rôles spécifiés
   */
  const hasAnyRole = (roles = []) => {
    return roles.includes(user?.roleLibelle);
  };

  /**
   * Obtenir le dashboard de l'utilisateur connecté
   */
  const getUserDashboard = () => {
    return user ? getDashboardRoute(user.roleLibelle) : '/login';
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
    getUserDashboard,
    isAuthenticated: !!user,
    loading,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};