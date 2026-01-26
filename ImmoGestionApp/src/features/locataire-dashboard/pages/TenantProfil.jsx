// src/features/locataire-dashboard/pages/TenantProfil.jsx

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  CheckCircle2,
  Loader2,
  XCircle,
  AlertCircle,
  Camera,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { Separator } from "../../../components/Separator";
import { Badge } from "../../../components/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/Dialog";
import { toast } from "../../../hooks/UseToast";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getUserDetails,
  updateUserDetails,
  formatInscriptionDate,
  isValidEmail,
  isValidPhone,
} from "../../../services/userService";

// Loading State
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
      <p className="text-lg font-medium text-foreground">Chargement du profil...</p>
    </div>
  </div>
);

// Error State
const ErrorState = ({ error, onRetry }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Erreur de chargement
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {error || "Impossible de charger votre profil"}
      </p>
      <Button onClick={onRetry} variant="outline">
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

export default function TenantProfil() {
  const { user, updateUser } = useAuth();
  
  // États
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tel: '',
    adresse: '',
    dob: '',
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Obtenir l'ID utilisateur
  const getUserId = () => {
    return user?.id || user?.userId || user?.user?.id;
  };

  // Charger les détails de l'utilisateur
  useEffect(() => {
    const chargerProfil = async () => {
      const userId = getUserId();
      
      if (!userId) {
        setError("Utilisateur non identifié");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const details = await getUserDetails(userId);
        console.log('✅ Profil chargé:', details);
        
        setUserDetails(details);
        setFormData({
          nom: details.nom || '',
          email: details.email || '',
          tel: details.tel || '',
          adresse: details.adresse || '',
          dob: details.dob || '',
        });
      } catch (err) {
        console.error('❌ Erreur chargement profil:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    chargerProfil();
  }, [user]);

  // Gérer les changements de formulaire
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Valider le formulaire
  const validateForm = () => {
    if (!formData.nom) {
      toast({
        title: "Erreur",
        description: "Le nom est requis",
        variant: "destructive"
      });
      return false;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: "Erreur",
        description: "Email invalide",
        variant: "destructive"
      });
      return false;
    }

    if (formData.tel && !isValidPhone(formData.tel)) {
      toast({
        title: "Erreur",
        description: "Numéro de téléphone invalide",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!validateForm()) return;

    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Erreur",
        description: "Utilisateur non identifié",
        variant: "destructive"
      });
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateUserDetails(userId, formData);
      console.log('✅ Profil mis à jour:', updatedUser);
      
      setUserDetails(updatedUser);
      setIsEditing(false);

      // Mettre à jour le contexte auth
      updateUser(updatedUser);

      toast({
        title: "Profil mis à jour ! ✨",
        description: "Vos informations ont été enregistrées avec succès.",
        className: "bg-success text-white"
      });
    } catch (err) {
      console.error('❌ Erreur mise à jour profil:', err);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Annuler l'édition
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nom: userDetails.nom || '',
      email: userDetails.email || '',
      tel: userDetails.tel || '',
      adresse: userDetails.adresse || '',
      dob: userDetails.dob || '',
    });
  };

  // Gérer l'upload de photo
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image",
        variant: "destructive"
      });
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 5 MB",
        variant: "destructive"
      });
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    try {
      setUploadingPhoto(true);

      // Convertir en base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);

        try {
          // Envoyer la photo via updateUserDetails
          const updatedUser = await updateUserDetails(userId, {
            photoUrl: base64String
          });

          console.log('✅ Photo mise à jour:', updatedUser);
          setUserDetails(prev => ({ ...prev, photoUrl: updatedUser.photoUrl }));
          
          // Mettre à jour le contexte auth
          updateUser({ ...user, photoUrl: updatedUser.photoUrl });

          toast({
            title: "Photo mise à jour ! 📸",
            description: "Votre photo de profil a été changée",
            className: "bg-success text-white"
          });
        } catch (err) {
          console.error('❌ Erreur upload photo:', err);
          toast({
            title: "Erreur",
            description: err.message,
            variant: "destructive"
          });
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('❌ Erreur lecture fichier:', err);
      toast({
        title: "Erreur",
        description: "Impossible de lire le fichier",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont requis",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 8 caractères",
        variant: "destructive"
      });
      return;
    }

    const userId = getUserId();
    if (!userId) return;

    try {
      // Envoyer via updateUserDetails
      await updateUserDetails(userId, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });

      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      toast({
        title: "Mot de passe changé ! 🔒",
        description: "Votre mot de passe a été mis à jour avec succès",
        className: "bg-success text-white"
      });
    } catch (err) {
      console.error('❌ Erreur changement mot de passe:', err);
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Afficher le loader
  if (loading) {
    return <LoadingState />;
  }

  // Afficher l'erreur
  if (error && !userDetails) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Calculer les initiales
  const initials = userDetails?.nom?.substring(0, 2).toUpperCase() || 'U';
  const photoUrl = photoPreview || userDetails?.photoUrl;

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
            {/* Avatar avec upload */}
            <div className="relative group">
              <Avatar className="h-28 w-28 ring-4 ring-secondary/20">
                {uploadingPhoto ? (
                  <div className="flex items-center justify-center bg-muted">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={photoUrl} />
                    <AvatarFallback className="bg-secondary text-white text-3xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              {/* Upload button (hover) */}
              <label
                htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="text-center text-white">
                  <Camera className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-xs font-medium">Changer</span>
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
                disabled={uploadingPhoto}
              />
            </div>
            
            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {userDetails?.nom}
              </h2>
              <p className="text-muted-foreground">
                Locataire depuis {formatInscriptionDate(userDetails?.dateCreation)}
              </p>
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
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
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
            <div className="space-y-2">
              <Label>Nom complet <span className="text-destructive">*</span></Label>
              <Input
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                disabled={!isEditing}
                placeholder="Ex: Marie Martin"
                className={isEditing ? "" : "bg-muted/50"}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de naissance</Label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
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
              <Label>Email <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
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
                  value={formData.tel}
                  onChange={(e) => handleChange('tel', e.target.value)}
                  placeholder="+225 XX XX XX XX XX"
                  disabled={!isEditing}
                  className={`pl-10 ${isEditing ? "" : "bg-muted/50"}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
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
                  Changez votre mot de passe régulièrement
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
              className="hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
            >
              Changer le mot de passe
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Vérifications de sécurité
            </h4>
            <div className="space-y-3">
              {userDetails?.emailVerifie && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Email vérifié</span>
                </div>
              )}
              {userDetails?.actif !== false && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Compte actif</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Identifiant: {userDetails?.id}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Badge */}
      {userDetails?.roleLibelle && (
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rôle</p>
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  {userDetails.roleLibelle}
                </Badge>
              </div>
              {userDetails?.actif !== false && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Statut</p>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Actif
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog Changement de mot de passe */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et choisissez-en un nouveau
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel <span className="text-destructive">*</span></Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe <span className="text-destructive">*</span></Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground">Au moins 8 caractères</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe <span className="text-destructive">*</span></Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handlePasswordChange} className="bg-secondary">
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}