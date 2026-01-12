import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export const AuthDialog = ({ open, onOpenChange, defaultTab = "login" }: AuthDialogProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
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
    // UI only (auth réelle à brancher plus tard)
  };

  const handleSocialLogin = (_provider: "google" | "facebook") => {
    // UI only (OAuth réelle à brancher plus tard)
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto p-0 bg-background border-border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 font-medium hover:bg-muted/50"
              onClick={() => handleSocialLogin("google")}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground font-semibold">
                G
              </span>
              Continuer avec Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 font-medium hover:bg-muted/50"
              onClick={() => handleSocialLogin("facebook")}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground font-semibold">
                f
              </span>
              Continuer avec Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              ou
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div className="space-y-2">
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
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
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
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  className="pl-10 pr-10 h-11"
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
              <div className="space-y-2">
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
                    className="pl-10 h-11"
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

            <Button type="submit" variant="primary" className="w-full h-11 font-semibold">
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
