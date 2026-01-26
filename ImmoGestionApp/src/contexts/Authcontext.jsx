// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../features/auth/api/authService";

const AuthContext = createContext(null);

// Mapping des rôles
export const ROLES = {
  ADMIN: "ADMIN",
  PROPRIETAIRE: "PROPRIETAIRE",
  GESTIONNAIRE: "GESTIONNAIRE",
  LOCATAIRE: "LOCATAIRE",
  USER: "USER",
};

// Mapping des rôles vers leurs dashboards
export const ROLE_ROUTES = {
  ADMIN: "/admin",
  PROPRIETAIRE: "/owner",
  GESTIONNAIRE: "/manager",
  LOCATAIRE: "/tenant",
  USER: "/",
};

// 🔥 Normalise l'utilisateur pour garantir user.id
const normalizeUser = (raw) => {
  if (!raw) return null;

  const id =
    raw.id ??
    raw.userId ??
    raw.utilisateurId ??
    raw.locataireId ??
    raw.personneId ??
    raw.compteId ??
    raw.uuid;

  return {
    ...raw,
    id,
    nom: raw.nom ?? raw.name ?? raw.username ?? raw.prenom ?? "Utilisateur",
    roleLibelle: raw.roleLibelle ?? raw.role ?? raw.roleName ?? raw.profil,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger user depuis storage au démarrage
  useEffect(() => {
    try {
      const currentUser = normalizeUser(authService.getCurrentUser());
      if (currentUser?.id) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Erreur lecture currentUser:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboardRoute = (roleLibelle) => {
    return ROLE_ROUTES[roleLibelle] || "/";
  };

  const login = async (identifier, password) => {
    const userData = await authService.login(identifier, password);
    const normalized = normalizeUser(userData);

    if (!normalized?.id) {
      throw new Error("Connexion ok mais ID utilisateur manquant (user.id)");
    }

    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));

    return {
      ...normalized,
      dashboardRoute: getDashboardRoute(normalized.roleLibelle),
    };
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = normalizeUser({ ...user, ...updatedData });
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const hasRole = (roleLibelle) => user?.roleLibelle === roleLibelle;

  const hasAnyRole = (roles = []) => roles.includes(user?.roleLibelle);

  const getUserDashboard = () =>
    user ? getDashboardRoute(user.roleLibelle) : "/";

  const value = useMemo(
    () => ({
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
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
