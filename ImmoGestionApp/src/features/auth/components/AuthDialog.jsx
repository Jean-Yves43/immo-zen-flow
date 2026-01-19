// src/features/auth/components/AuthDialog.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Separator } from "../../../components/Separator";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ShieldAlert, Clock } from "lucide-react";
import { useAuth } from "../../../contexts/Authcontext";

export const AuthDialog = ({
  open,
  onOpenChange,
  defaultTab = "login",
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /**
   * Réinitialise l'onglet actif à l'ouverture du dialog
   */
  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
      setError({ type: '', message: '' });
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [defaultTab, open]);

  /**
   * Gestion des champs du formulaire
   */
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError({ type: '', message: '' }); // Efface l'erreur lors de la saisie
  };

  /**
   * Validation du formulaire d'inscription
   */
  const validateSignupForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError({ type: 'validation', message: 'Les mots de passe ne correspondent pas' });
      return false;
    }
    if (formData.password.length < 8) {
      setError({ type: 'validation', message: 'Le mot de passe doit contenir au moins 8 caractères' });
      return false;
    }
    return true;
  };

  /**
   * Détermine le type d'erreur selon le message du backend
   */
  const getErrorType = (message) => {
    if (message.toLowerCase().includes('bloqué')) return 'blocked';
    if (message.toLowerCase().includes('expiré')) return 'expired';
    if (message.toLowerCase().includes('invalides')) return 'invalid';
    if (message.toLowerCase().includes('non trouvé')) return 'notfound';
    return 'general';
  };

  /**
   * Obtenir l'icône selon le type d'erreur
   */
  const getErrorIcon = (type) => {
    switch(type) {
      case 'blocked':
        return <ShieldAlert className="w-5 h-5 text-destructive" />;
      case 'expired':
        return <Clock className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-destructive" />;
    }
  };

  /**
   * Soumission du formulaire de connexion
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);
      
      // Fermer le dialog
      onOpenChange(false);
      
      // Redirection automatique vers le dashboard selon le rôle
      navigate(userData.dashboardRoute);
    } catch (err) {
      const errorMessage = err.message || "Une erreur s'est produite";
      const errorType = getErrorType(errorMessage);
      
      // Messages personnalisés selon le type d'erreur
      let displayMessage = errorMessage;
      
      switch(errorType) {
        case 'blocked':
          displayMessage = "Votre compte a été bloqué. Veuillez contacter l'administrateur.";
          break;
        case 'expired':
          displayMessage = "Votre compte a expiré. Veuillez contacter l'administrateur pour le renouveler.";
          break;
        case 'invalid':
          displayMessage = "Email ou mot de passe incorrect. Veuillez réessayer.";
          break;
        case 'notfound':
          displayMessage = "Aucun compte associé à cet email. Vérifiez votre saisie ou créez un compte.";
          break;
      }
      
      setError({ type: errorType, message: displayMessage });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soumission du formulaire d'inscription
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError({ type: '', message: '' });

    // Validation
    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Appel API d'inscription à implémenter
      console.log("Inscription:", formData);
      setError({ type: 'info', message: "L'inscription n'est pas encore disponible" });
    } catch (err) {
      setError({ type: 'general', message: err.message || "Erreur lors de l'inscription" });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  /**
   * Connexion sociale (UI only)
   */
  const handleSocialLogin = (provider) => {
    console.log("Login with", provider);
    setError({ type: 'info', message: "La connexion sociale n'est pas encore disponible" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-background border-border">
        {/* Onglets Login / Signup */}
        <div className="flex border-b border-border">
          <button
            onClick={() => {
              setActiveTab("login");
              setError({ type: '', message: '' });
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "login"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Se connecter
            {activeTab === "login" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("signup");
              setError({ type: '', message: '' });
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === "signup"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Créer un compte
            {activeTab === "signup" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Bienvenue !" : "Rejoignez-nous"}
            </DialogTitle>
            <p className="text-center text-muted-foreground text-sm mt-2">
              {activeTab === "login"
                ? "Connectez-vous pour accéder à votre espace"
                : "Créez votre compte en quelques secondes"}
            </p>
          </DialogHeader>

          {/* Message d'erreur amélioré */}
          {error.message && (
            <div className={`mb-4 p-4 rounded-lg border flex items-start gap-3 ${
              error.type === 'blocked' || error.type === 'expired' 
                ? 'bg-destructive/10 border-destructive/20' 
                : error.type === 'info'
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-destructive/10 border-destructive/20'
            }`}>
              {getErrorIcon(error.type)}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  error.type === 'info' ? 'text-blue-600 dark:text-blue-400' : 'text-destructive'
                }`}>
                  {error.message}
                </p>
                
                {/* Aide contextuelle selon le type d'erreur */}
                {error.type === 'blocked' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Contactez support@immogestion.com pour débloquer votre compte
                  </p>
                )}
                {error.type === 'expired' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre abonnement doit être renouvelé
                  </p>
                )}
                {error.type === 'invalid' && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline mt-1"
                    onClick={() => {/* TODO: Mot de passe oublié */}}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Boutons sociaux */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 font-medium hover:bg-muted/50"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted font-semibold">
                G
              </span>
              Continuer avec Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 font-medium hover:bg-muted/50"
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted font-semibold">
                f
              </span>
              Continuer avec Facebook
            </Button>
          </div>

          {/* Séparateur */}
          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              ou
            </span>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 h-11"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11"
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-11"
                  required
                  disabled={loading}
                  autoComplete={activeTab === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {activeTab === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 h-11"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            {activeTab === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  {activeTab === "login" ? "Connexion..." : "Création..."}
                </span>
              ) : (
                activeTab === "login" ? "Se connecter" : "Créer mon compte"
              )}
            </Button>
          </form>

          {/* Mentions légales */}
          {activeTab === "signup" && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              En créant un compte, vous acceptez nos{" "}
              <a href="#" className="text-primary hover:underline">
                Conditions d'utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-primary hover:underline">
                Politique de confidentialité
              </a>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};