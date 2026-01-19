// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement...</p>
      </div>
    );
  }

  // Rediriger vers login si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si des rôles sont requis
  if (allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(user?.roleLibelle);
    
    if (!hasPermission) {
      // Rediriger vers le dashboard approprié de l'utilisateur
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;