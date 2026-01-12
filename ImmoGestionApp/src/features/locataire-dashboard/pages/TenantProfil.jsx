import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { Separator } from "../../../components/Separator";
import { toast } from "../../../hooks/UseToast";

export default function TenantProfil() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profil mis à jour ! ✨",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-border/50 shadow-soft animate-fade-up">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-28 w-28 ring-4 ring-secondary/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary text-white text-3xl font-bold">
                  MM
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            {/* Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-foreground">
                Marie Martin
              </h2>
              <p className="text-muted-foreground">Locataire depuis janvier 2024</p>
              <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-success font-medium">
                  Compte vérifié
                </span>
              </div>
            </div>
            {/* Edit Button */}
            <div className="sm:ml-auto">
              {isEditing ? (
                <Button
                  onClick={handleSave}
                  className="bg-secondary hover:bg-secondary-light"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Modifier
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-100">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input
                  defaultValue="Marie"
                  disabled={!isEditing}
                  className={isEditing ? "" : "bg-muted/50"}
                />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  defaultValue="Martin"
                  disabled={!isEditing}
                  className={isEditing ? "" : "bg-muted/50"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                defaultValue="1990-05-15"
                disabled={!isEditing}
                className={isEditing ? "" : "bg-muted/50"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-secondary" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  defaultValue="marie.martin@email.com"
                  disabled={!isEditing}
                  className={`pl-10 ${isEditing ? "" : "bg-muted/50"}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="tel"
                  defaultValue="06 12 34 56 78"
                  disabled={!isEditing}
                  className={`pl-10 ${isEditing ? "" : "bg-muted/50"}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse de facturation</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  defaultValue="15 Rue Lepic, 75018 Paris"
                  disabled={!isEditing}
                  className={`pl-10 ${isEditing ? "" : "bg-muted/50"}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Mot de passe</p>
                <p className="text-sm text-muted-foreground">
                  Dernière modification : il y a 3 mois
                </p>
              </div>
            </div>
            <Button variant="outline" className="hover:bg-secondary/10 hover:text-secondary hover:border-secondary">
              Changer le mot de passe
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Vérifications de sécurité
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Email vérifié</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Téléphone vérifié</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Identité vérifiée</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}