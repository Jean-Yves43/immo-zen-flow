import { useState, useEffect, useRef } from "react";
import {
  Wrench,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Loader2,
  FileQuestion,
  XCircle,
  X,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dialog";
import { toast } from "../../../hooks/UseToast";
import { getMaintenancesByLocataire, createMaintenance } from "../api/maintenance";
import { useAuth } from "../../../contexts/AuthContext";

const iconMap = {
  AlertCircle,
  Clock,
  CheckCircle2,
};

const urgencyConfig = {
  FAIBLE: { className: "bg-green-500/10 text-green-700", label: "Faible", icon: null },
  MOYEN: { className: "bg-yellow-500/10 text-yellow-700", label: "Moyen", icon: null },
  URGENT: { className: "bg-orange-500/10 text-orange-700", label: "Urgent", icon: "AlertCircle" },
  CRITIQUE: { className: "bg-destructive/10 text-destructive", label: "Critique", icon: "AlertCircle" },
};

const statusConfig = {
  SOUMISE: { className: "bg-warning/10 text-warning", label: "Soumise", icon: "Clock" },
  EN_COURS: { className: "bg-blue-500/10 text-blue-700", label: "En cours", icon: "Wrench" },
  RESOLUE: { className: "bg-success/10 text-success", label: "Résolue", icon: "CheckCircle2" },
  ANNULEE: { className: "bg-muted text-muted-foreground", label: "Annulée", icon: null },
};

// Composant Loading
const LoadingState = () => (
  <div className="max-w-6xl mx-auto space-y-6 p-6">
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
        <div>
          <p className="text-lg font-medium text-foreground">Chargement en cours...</p>
          <p className="text-sm text-muted-foreground">Récupération de vos demandes de maintenance</p>
        </div>
      </div>
    </div>
  </div>
);

// Composant Empty State pour les demandes en cours
const EmptyActiveRequests = ({ onNewRequest }) => (
  <Card className="border-dashed border-2 border-border/50">
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
        <Wrench className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Aucune demande en cours
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Vous n'avez aucune demande de maintenance active pour le moment.
        Signalez un problème si nécessaire.
      </p>
      <Button onClick={onNewRequest} className="bg-secondary hover:bg-secondary/90">
        <Plus className="w-4 h-4 mr-2" />
        Nouvelle demande
      </Button>
    </CardContent>
  </Card>
);

// Composant Error State
const ErrorState = ({ error, onRetry }) => (
  <div className="max-w-6xl mx-auto space-y-6 p-6">
    <Card className="border-destructive/50">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <XCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Erreur de chargement
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {error || "Une erreur s'est produite lors du chargement de vos demandes."}
        </p>
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Composant Auth Error
const AuthErrorState = () => (
  <div className="max-w-6xl mx-auto space-y-6 p-6">
    <Card className="border-warning/50 bg-warning/5">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Session expirée
        </h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Votre session a expiré ou vos informations de connexion sont incomplètes.
          Veuillez vous reconnecter.
        </p>
        <Button onClick={() => window.location.href = '/login'} className="bg-secondary hover:bg-secondary/90">
          Se reconnecter
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default function TenantMaintenance() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const pollingRef = useRef(null);

  // 🔍 DEBUG - À retirer après résolution du problème
  useEffect(() => {
    console.log('🔍 DEBUG - User object:', user);
    console.log('🔍 DEBUG - User ID:', user?.id);
    console.log('🔍 DEBUG - User userId:', user?.userId);
    if (user) {
      console.log('🔍 DEBUG - All user keys:', Object.keys(user));
    }
  }, [user]);

  // ✅ Fonction pour obtenir l'ID de manière robuste
  const getUserId = () => {
    // Essayer différentes propriétés possibles
    return user?.id || user?.userId || user?.user?.id || null;
  };

  // Récupération des maintenances
  const fetchMaintenances = async () => {
    const userId = getUserId();
    
    if (!userId) {
      console.warn('⚠️ User ID not available. User object:', user);
      setError('Informations utilisateur incomplètes');
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      const data = await getMaintenancesByLocataire(userId);
      setMaintenanceRequests(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des maintenances:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour automatique pour les maintenances "SOUMISE"
  useEffect(() => {
    fetchMaintenances();

    pollingRef.current = setInterval(() => {
      const userId = getUserId();
      if (userId && !loading) {
        const hasSoumise = maintenanceRequests.some(r => r.statut === "SOUMISE");
        if (hasSoumise) {
          getMaintenancesByLocataire(userId)
            .then(data => setMaintenanceRequests(data || []))
            .catch(err => console.error("Erreur polling:", err));
        }
      }
    }, 10000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [user]);

  // Gestion de la sélection de photo
  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La photo ne doit pas dépasser 5 MB",
          variant: "destructive"
        });
        return;
      }

      setPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', type: '', priority: '' });
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUrgencyBadge = (urgency) => {
    const config = urgencyConfig[urgency] || { className: "bg-muted", label: urgency, icon: null };
    const Icon = config.icon ? iconMap[config.icon] : null;
    return (
      <Badge className={config.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const renderStatusBadge = (status) => {
    const config = statusConfig[status] || { className: "bg-muted", label: status, icon: null };
    const Icon = config.icon ? iconMap[config.icon] : null;
    return (
      <Badge className={config.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {config.label}
      </Badge>
    );
  };

  const handleSubmit = async () => {
    const userId = getUserId();
    
    // ✅ Vérification robuste de l'ID utilisateur
    if (!userId) {
      console.error('❌ User ID non disponible. User object:', user);
      toast({ 
        title: "Erreur d'authentification", 
        description: "Votre session a expiré. Veuillez vous reconnecter.", 
        variant: "destructive" 
      });
      return;
    }

    // Validation
    if (!formData.type || !formData.priority || !formData.title || !formData.description) {
      toast({ 
        title: "Erreur", 
        description: "Veuillez remplir tous les champs obligatoires.", 
        variant: "destructive" 
      });
      return;
    }

    if (formData.description.length < 10) {
      toast({ 
        title: "Erreur", 
        description: "La description doit contenir au moins 10 caractères.", 
        variant: "destructive" 
      });
      return;
    }

    setSubmitting(true);
    try {
      const maintenanceData = {
        title: formData.title,
        description: formData.description,
        type: formData.type.toUpperCase(),
        priority: formData.priority.toUpperCase(),
        statut: "SOUMISE",
        categorie: formData.type.toUpperCase(),
        urgence: formData.priority.toUpperCase(),
        locationId: 1, // ⚠️ À adapter selon votre contexte
        motif: formData.title,
      };

      console.log('📤 Envoi demande maintenance:', { userId, maintenanceData, hasPhoto: !!photoFile });

      await createMaintenance(userId, maintenanceData, photoFile);
      
      toast({ 
        title: "Succès", 
        description: "Votre demande de maintenance a été enregistrée.",
        className: "bg-success text-white"
      });
      
      setIsDialogOpen(false);
      resetForm();
      
      setLoading(true);
      await fetchMaintenances();
    } catch (error) {
      console.error("❌ Erreur création maintenance:", error);
      toast({ 
        title: "Erreur", 
        description: error.message || "Impossible de créer la demande", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Vérifier si l'utilisateur est authentifié avec un ID valide
  if (!getUserId()) {
    return <AuthErrorState />;
  }

  if (loading && maintenanceRequests.length === 0) {
    return <LoadingState />;
  }

  if (error && maintenanceRequests.length === 0) {
    return <ErrorState error={error} onRetry={fetchMaintenances} />;
  }

  const activeRequests = maintenanceRequests.filter(
    (r) => r.statut !== "RESOLUE" && r.statut !== "ANNULEE"
  );
  const resolvedRequests = maintenanceRequests.filter((r) => r.statut === "RESOLUE");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Signalez un problème ou suivez vos demandes en cours
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Signaler un problème</DialogTitle>
              <DialogDescription>
                Décrivez le problème rencontré dans votre logement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type de problème *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plomberie">Plomberie</SelectItem>
                    <SelectItem value="electricite">Électricité</SelectItem>
                    <SelectItem value="serrurerie">Serrurerie</SelectItem>
                    <SelectItem value="menuiserie">Menuiserie</SelectItem>
                    <SelectItem value="peinture">Peinture</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Niveau d'urgence *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une urgence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faible">Faible</SelectItem>
                    <SelectItem value="moyen">Moyen</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ex: Fuite d'eau dans la salle de bain"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez le problème en détail... (minimum 10 caractères)"
                  className="min-h-[100px]"
                  minLength={10}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description.length} / 1000 caractères
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Photo (optionnel)</Label>
                
                {photoPreview ? (
                  <div className="relative border-2 border-border rounded-xl overflow-hidden">
                    <img 
                      src={photoPreview} 
                      alt="Prévisualisation" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleRemovePhoto}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="truncate">{photoFile?.name}</span>
                        <span className="text-xs opacity-75">
                          ({(photoFile?.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-secondary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Cliquez pour ajouter une photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG (max 5 MB)
                    </p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handlePhotoSelect}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="flex-1 bg-secondary hover:bg-secondary/90"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Soumettre la demande"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Demandes en cours
            </h2>
            {activeRequests.length > 0 && (
              <Badge variant="secondary">{activeRequests.length}</Badge>
            )}
          </div>
          
          {activeRequests.length === 0 ? (
            <EmptyActiveRequests onNewRequest={() => setIsDialogOpen(true)} />
          ) : (
            activeRequests.map((request, index) => (
              <Card
                key={request.ficheId}
                className={`border-border/50 shadow-soft cursor-pointer transition-all hover:shadow-medium hover:-translate-y-1 animate-fade-up ${
                  selectedRequest?.ficheId === request.ficheId ? "ring-2 ring-secondary" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedRequest(request)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.description || "Demande de maintenance"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.categorie} • {new Date(request.dateDemande).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderUrgencyBadge(request.urgence)}
                    {renderStatusBadge(request.statut)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Request Details / Timeline */}
        <Card className="border-border/50 shadow-soft h-fit animate-fade-up animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {selectedRequest ? "Suivi de la demande" : "Sélectionnez une demande"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedRequest.description}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {renderUrgencyBadge(selectedRequest.urgence)}
                    {renderStatusBadge(selectedRequest.statut)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{selectedRequest.categorie}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(selectedRequest.dateDemande).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {selectedRequest.bienRef && (
                      <div>
                        <p className="text-muted-foreground">Bien</p>
                        <p className="font-medium">{selectedRequest.bienRef}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">ID Fiche</p>
                      <p className="font-medium">#{selectedRequest.ficheId}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Progression</h4>
                  <div className="space-y-3">
                    <div className="flex gap-4 pb-2">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-success text-white`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-foreground">
                          Demande soumise
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedRequest.dateDemande).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    {selectedRequest.statut === "EN_COURS" && (
                      <div className="flex gap-4 pb-2">
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 flex-1 bg-success mt-2 mb-2" />
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white`}>
                            <Wrench className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="font-medium text-foreground">
                            Intervention en cours
                          </p>
                          <p className="text-sm text-muted-foreground">
                            En cours de traitement
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.statut === "RESOLUE" && (
                      <>
                        <div className="flex gap-4 pb-2">
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 flex-1 bg-blue-500 mt-2 mb-2" />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white`}>
                              <Wrench className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-medium text-foreground">
                              Intervention terminée
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-0.5 flex-1 bg-blue-500 mt-2 mb-2" />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-success text-white`}>
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="font-medium text-foreground">
                              Demande résolue
                            </p>
                            {selectedRequest.dateResolution && (
                              <p className="text-sm text-muted-foreground">
                                {new Date(selectedRequest.dateResolution).toLocaleString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Cliquez sur une demande pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resolved Requests */}
      {resolvedRequests.length > 0 && (
        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Demandes résolues
              </div>
              <Badge variant="secondary">{resolvedRequests.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resolvedRequests.map((request) => (
                <div
                  key={request.ficheId}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {request.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.categorie} • Résolu le {new Date(request.dateResolution).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {renderStatusBadge(request.statut)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}