import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

// ========================================
// SIMULATION : Base de données utilisateurs
// ========================================
const MOCK_USERS = [
  {
    id: 1,
    email: "admin@immogestion.com",
    password: "admin123",
    name: "Admin Principal",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  {
    id: 2,
    email: "proprietaire@example.com",
    password: "proprio123",
    name: "Jean Dupont",
    role: "proprietaire",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
  },
  {
    id: 3,
    email: "locataire@example.com",
    password: "locataire123",
    name: "Marie Martin",
    role: "locataire",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
  },
  {
    id: 4,
    email: "agent@immogestion.com",
    password: "agent123",
    name: "Pierre Durand",
    role: "agent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
  },
];

// ========================================
// Redirection selon le rôle
// ========================================
const ROLE_ROUTES = {
  admin: "/admin/dashboard",
  proprietaire: "/proprietaire/dashboard",
  locataire: "/locataire/dashboard",
  agent: "/agent/dashboard",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier si un utilisateur est déjà connecté (localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * SIMULATION : Connexion
   */
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      // Simulation d'un délai réseau
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const userData = { ...foundUser };
          delete userData.password; // Ne pas stocker le mot de passe

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          // Rediriger selon le rôle
          const redirectPath = ROLE_ROUTES[userData.role] || "/";
          navigate(redirectPath);

          resolve({ success: true, user: userData });
        } else {
          reject({ success: false, message: "Email ou mot de passe incorrect" });
        }
      }, 800); // Délai de 800ms pour simuler le réseau
    });
  };

  /**
   * SIMULATION : Inscription
   */
  const signup = async (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Vérifier si l'email existe déjà
        const existingUser = MOCK_USERS.find((u) => u.email === email);

        if (existingUser) {
          reject({ success: false, message: "Cet email est déjà utilisé" });
          return;
        }

        // Créer un nouvel utilisateur (par défaut : locataire)
        const newUser = {
          id: MOCK_USERS.length + 1,
          email,
          name,
          role: "locataire", // Rôle par défaut
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };

        MOCK_USERS.push({ ...newUser, password }); // Ajouter à la "base de données"

        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));

        // Rediriger vers le dashboard locataire
        navigate(ROLE_ROUTES.locataire);

        resolve({ success: true, user: newUser });
      }, 800);
    });
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  /**
   * SIMULATION : Connexion sociale (Google, Facebook)
   */
  const socialLogin = async (provider) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simuler une connexion sociale réussie
        const mockSocialUser = {
          id: Date.now(),
          email: `user.${provider}@example.com`,
          name: `Utilisateur ${provider}`,
          role: "locataire",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
        };

        setUser(mockSocialUser);
        localStorage.setItem("user", JSON.stringify(mockSocialUser));
        navigate(ROLE_ROUTES.locataire);

        resolve({ success: true, user: mockSocialUser });
      }, 1000);
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    socialLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};