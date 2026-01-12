import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

type UserRole = "admin" | "manager" | "owner" | "tenant";

interface MockUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Mock users for simulation
const mockUsers: MockUser[] = [
  { email: "admin@immo.com", password: "admin123", name: "Admin Principal", role: "admin" },
  { email: "gestionnaire@immo.com", password: "manager123", name: "Marie Gestionnaire", role: "manager" },
  { email: "proprietaire@immo.com", password: "owner123", name: "Pierre Propriétaire", role: "owner" },
  { email: "locataire@immo.com", password: "tenant123", name: "Sophie Locataire", role: "tenant" },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administrateur",
  manager: "Gestionnaire",
  owner: "Propriétaire",
  tenant: "Locataire",
};

const roleDashboards: Record<UserRole, string> = {
  admin: "/admin",
  manager: "/manager",
  owner: "/owner",
  tenant: "/tenant",
};

export const AuthDialog = ({ open, onOpenChange, defaultTab = "login" }: AuthDialogProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("tenant");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (open) setActiveTab(defaultTab);
  }, [defaultTab, open]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (activeTab === "login") {
      // Find user by email and password
      const user = mockUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Store user in localStorage for simulation
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success(`Bienvenue ${user.name} !`, {
          description: `Connexion en tant que ${roleLabels[user.role]}`,
        });
        onOpenChange(false);
        navigate(roleDashboards[user.role]);
      } else {
        toast.error("Identifiants incorrects", {
          description: "Vérifiez votre email et mot de passe",
        });
      }
    } else {
      // Signup - create new user with selected role
      if (formData.password !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      const newUser: MockUser = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: selectedRole,
      };

      // Store user in localStorage for simulation
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      toast.success(`Compte créé avec succès !`, {
        description: `Bienvenue ${newUser.name}, votre compte ${roleLabels[selectedRole]} est activé`,
      });
      onOpenChange(false);
      navigate(roleDashboards[selectedRole]);
    }
  };

  const handleSocialLogin = (_provider: "google" | "facebook") => {
    toast.info("Connexion sociale", {
      description: "Cette fonctionnalité sera disponible prochainement",
    });
  };

  const handleQuickLogin = (user: MockUser) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    toast.success(`Connexion rapide - ${user.name}`, {
      description: `Vous êtes connecté en tant que ${roleLabels[user.role]}`,
    });
    onOpenChange(false);
    navigate(roleDashboards[user.role]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto p-0 bg-background border-border">
        {/* Header with tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("login")}
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
            onClick={() => setActiveTab("signup")}
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
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Bienvenue !" : "Rejoignez-nous"}
            </DialogTitle>
            <p className="text-center text-muted-foreground text-sm mt-2">
              {activeTab === "login"
                ? "Connectez-vous pour accéder à votre espace"
                : "Créez votre compte en quelques secondes"}
            </p>
          </DialogHeader>

          {/* Quick Login Buttons for Demo */}
          {activeTab === "login" && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Connexion rapide (Démo)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mockUsers.map((user) => (
                  <Button
                    key={user.role}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 px-3 flex flex-col items-start gap-0.5 hover:bg-primary/10 hover:border-primary"
                    onClick={() => handleQuickLogin(user)}
                  >
                    <span className="text-xs font-semibold">{roleLabels[user.role]}</span>
                    <span className="text-[10px] text-muted-foreground">{user.email}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {activeTab === "login" && (
            <div className="relative mb-4">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                ou avec identifiants
              </span>
            </div>
          )}

          {/* Social Login Buttons */}
          {activeTab === "signup" && (
            <>
              <div className="space-y-3 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 gap-3 font-medium hover:bg-muted/50"
                  onClick={() => handleSocialLogin("google")}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-sm">
                    G
                  </span>
                  Continuer avec Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 gap-3 font-medium hover:bg-muted/50"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground font-semibold text-sm">
                    f
                  </span>
                  Continuer avec Facebook
                </Button>
              </div>

              <div className="relative mb-4">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
                  ou
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom complet
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-sm font-medium">
                    Type de compte
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                      <SelectTrigger className="pl-10 h-10">
                        <SelectValue placeholder="Sélectionnez votre rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Locataire</SelectItem>
                        <SelectItem value="owner">Propriétaire</SelectItem>
                        <SelectItem value="manager">Gestionnaire</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Adresse email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 h-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
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
                    className="pl-10 h-10"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full h-10 font-semibold">
              {activeTab === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          {/* Terms */}
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