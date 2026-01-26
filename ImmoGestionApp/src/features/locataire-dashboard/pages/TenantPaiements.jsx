// src/features/locataire-dashboard/pages/TenantPaiements.jsx

import { useState, useEffect } from "react";
import {
  Euro,
  CreditCard,
  Shield,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Loader2,
  AlertCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { RadioGroup, RadioGroupItem } from "../../../components/RadioGroup";
import { Label } from "../../../components/Label";
import { Input } from "../../../components/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/Dialog";
import { toast } from "../../../hooks/UseToast";
import { useAuth } from "../../../contexts/AuthContext";
import {
  previewPaiement,
  effectuerPaiementIntelligent,
  getStatistiquesPaiement,
  validerDonneesPaiementIntelligent,
  getLibelleMethodePaiement,
  formaterMontantFCFA,
} from "../api/paiementLocataire";

// Options Mobile Money
const MOBILE_MONEY_OPTIONS = [
  {
    id: "WAVE",
    name: "Wave",
    description: "Paiement via Wave",
    icon: "📱",
    color: "bg-blue-500",
  },
  {
    id: "ORANGE_MONEY",
    name: "Orange Money",
    description: "Paiement via Orange Money",
    icon: "🟠",
    color: "bg-orange-500",
  },
  {
    id: "MOOV_MONEY",
    name: "Moov Money",
    description: "Paiement via Moov Money",
    icon: "🔵",
    color: "bg-blue-600",
  },
  {
    id: "MTN_MONEY",
    name: "MTN Money",
    description: "Paiement via MTN Money",
    icon: "🟡",
    color: "bg-yellow-500",
  },
];

// Composant Preview des paiements
const PaymentPreview = ({ preview, onConfirm, onCancel, isProcessing }) => {
  return (
    <Card className="border-secondary/50 shadow-large animate-fade-up">
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          Prévisualisation du paiement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Résumé */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80">Montant total</span>
            <Badge className="bg-white/20 text-white hover:bg-white/30">
              {preview.nombreMoisDemandes} mois
            </Badge>
          </div>
          <p className="text-4xl font-bold">{formaterMontantFCFA(preview.montantTotal)}</p>
          <p className="text-white/80 text-sm mt-2">
            {formaterMontantFCFA(preview.montantMensuel)} × {preview.nombreMoisDemandes} mois
          </p>
        </div>

        {/* Avertissement si retards */}
        {preview.avertissement && (
          <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl animate-fade-up">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning mb-1">Attention</p>
              <p className="text-sm text-muted-foreground">{preview.avertissement}</p>
            </div>
          </div>
        )}

        {/* Répartition */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Répartition des paiements</h4>
          
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3">
            {preview.nombreRetards > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-destructive">{preview.nombreRetards}</p>
                <p className="text-xs text-destructive">Retard{preview.nombreRetards > 1 ? 's' : ''}</p>
              </div>
            )}
            {preview.nombreMoisActuel > 0 && (
              <div className="p-3 bg-success/10 border border-success/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-success">{preview.nombreMoisActuel}</p>
                <p className="text-xs text-success">Actuel</p>
              </div>
            )}
            {preview.nombreMoisFuturs > 0 && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg text-center">
                <p className="text-2xl font-bold text-primary">{preview.nombreMoisFuturs}</p>
                <p className="text-xs text-primary">Avance</p>
              </div>
            )}
          </div>

          {/* Détail des mois */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {preview.moisQuiSerontPayes.map((mois, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                  mois.categorie === "RETARD"
                    ? "bg-destructive/5 border-destructive/30"
                    : mois.categorie === "ACTUEL"
                    ? "bg-success/5 border-success/30"
                    : "bg-primary/5 border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      mois.categorie === "RETARD"
                        ? "bg-destructive"
                        : mois.categorie === "ACTUEL"
                        ? "bg-success"
                        : "bg-primary"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-sm">{mois.mois}</p>
                    {mois.joursRetard && (
                      <p className="text-xs text-destructive">
                        En retard de {mois.joursRetard} jour{mois.joursRetard > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-sm">{formaterMontantFCFA(mois.montant)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Modifier
          </Button>
          <Button
            className="flex-1 bg-secondary hover:bg-secondary/90"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Confirmer le paiement
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de succès
const PaymentSuccess = ({ paiementResponse, onBack }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-border/50 shadow-large overflow-hidden">
        <div className="bg-gradient-to-br from-success to-secondary p-8 text-center text-white">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2 animate-fade-up">
            Paiement réussi !
          </h1>
          <p className="text-white/90 animate-fade-up animation-delay-100">
            {paiementResponse.message}
          </p>
        </div>
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2 animate-fade-up animation-delay-200">
            <p className="text-3xl font-bold text-foreground">
              {formaterMontantFCFA(paiementResponse.montantTotal)}
            </p>
            <p className="text-muted-foreground">
              {paiementResponse.nombrePaiements} paiement{paiementResponse.nombrePaiements > 1 ? 's' : ''} effectué{paiementResponse.nombrePaiements > 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Badges de statut */}
          <div className="flex flex-wrap gap-2 justify-center animate-fade-up animation-delay-300">
            {paiementResponse.nombreRetardsRegles > 0 && (
              <Badge className="bg-destructive/10 text-destructive border border-destructive/30">
                {paiementResponse.nombreRetardsRegles} retard{paiementResponse.nombreRetardsRegles > 1 ? 's' : ''} réglé{paiementResponse.nombreRetardsRegles > 1 ? 's' : ''}
              </Badge>
            )}
            {paiementResponse.nombreMoisAvance > 0 && (
              <Badge className="bg-primary/10 text-primary border border-primary/30">
                {paiementResponse.nombreMoisAvance} mois d'avance
              </Badge>
            )}
          </div>
          
          <div className="space-y-3 animate-fade-up animation-delay-400">
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Référence</span>
              <span className="font-medium">{paiementResponse.referenceTransaction}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date(paiementResponse.dateTransaction).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">Méthode</span>
              <span className="font-medium">
                {getLibelleMethodePaiement(paiementResponse.methodePaiement)}
              </span>
            </div>
          </div>

          {/* Liste des paiements effectués */}
          <div className="space-y-2 animate-fade-up animation-delay-500">
            <h3 className="font-semibold text-foreground">Détails des paiements</h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {paiementResponse.paiementsEffectues.map((p, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    p.statut === "RETARD_REGLE"
                      ? "bg-destructive/5 border-destructive/30"
                      : p.statut === "AVANCE"
                      ? "bg-primary/5 border-primary/30"
                      : "bg-success/5 border-success/30"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{p.mois}</span>
                      <Badge
                        className={`ml-2 text-xs ${
                          p.statut === "RETARD_REGLE"
                            ? "bg-destructive/20 text-destructive"
                            : p.statut === "AVANCE"
                            ? "bg-primary/20 text-primary"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {p.statut === "RETARD_REGLE" ? "Retard réglé" : p.statut === "AVANCE" ? "Avance" : "Payé"}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold">{formaterMontantFCFA(p.montant)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 animate-fade-up animation-delay-600">
            <Button
              className="flex-1"
              onClick={onBack}
            >
              Retour aux paiements
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant principal
export default function TenantPaiements() {
  const { user } = useAuth();
  
  // États
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedMobileMoney, setSelectedMobileMoney] = useState(null);
  const [showMobileMoneyDialog, setShowMobileMoneyDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState(null);
  const [paiementResponse, setPaiementResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Données de paiement simplifié
  const [locationId] = useState(2); // À récupérer depuis le contexte ou les props
  const [nombreMois, setNombreMois] = useState("");
  const [montantMensuel, setMontantMensuel] = useState("");
  const [numeroTelephone, setNumeroTelephone] = useState("");

  // Statistiques
  const [statistiques, setStatistiques] = useState(null);

  // Charger les données initiales
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        console.log('🔍 User:', user);
        console.log('🔍 User ID:', user?.id);

        // Charger les statistiques
        if (user?.id && locationId) {
          const stats = await getStatistiquesPaiement(user.id, locationId);
          setStatistiques(stats);
        }
      } catch (error) {
        console.error('Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    chargerDonnees();
  }, [user?.id, locationId]);

  // Calculer le montant total
  const montantTotal = nombreMois && montantMensuel 
    ? parseFloat(montantMensuel) * parseInt(nombreMois) 
    : 0;

  // Gérer le clic sur Mobile Money
  const handleMobileMoneyClick = () => {
    setPaymentMethod("mobile_money");
    setShowMobileMoneyDialog(true);
  };

  // Sélectionner un fournisseur Mobile Money
  const handleSelectMobileMoney = (provider) => {
    setSelectedMobileMoney(provider);
    setShowMobileMoneyDialog(false);
  };

  // Obtenir l'ID du locataire
  const getLocataireId = () => {
    const id = user?.id || user?.userId || user?.user?.id;
    console.log('🔍 Locataire ID récupéré:', id);
    return id;
  };

  // Prévisualiser le paiement
  const handlePreview = async () => {
    const locataireId = getLocataireId();
    
    if (!locataireId) {
      toast({
        title: "Erreur",
        description: "Impossible d'identifier l'utilisateur.",
        variant: "destructive"
      });
      return;
    }

    // Validation basique
    if (!nombreMois || parseInt(nombreMois) < 1 || parseInt(nombreMois) > 12) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nombre de mois entre 1 et 12",
        variant: "destructive"
      });
      return;
    }

    if (!montantMensuel || parseFloat(montantMensuel) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un montant mensuel valide",
        variant: "destructive"
      });
      return;
    }

    // Déterminer la méthode de paiement
    let methodePaiement;
    if (paymentMethod === "card") {
      methodePaiement = "VISA";
    } else if (paymentMethod === "mobile_money" && selectedMobileMoney) {
      methodePaiement = selectedMobileMoney.id;
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une méthode de paiement",
        variant: "destructive"
      });
      return;
    }

    // Vérifier le numéro de téléphone pour Mobile Money
    if (paymentMethod === "mobile_money" && !numeroTelephone) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    // Préparer les données
    const paiementData = {
      locationId: locationId,
      nombreMois: parseInt(nombreMois),
      montantMensuel: parseFloat(montantMensuel),
      methodePaiement: methodePaiement,
    };

    // Ajouter les informations selon la méthode
    if (paymentMethod === "mobile_money") {
      paiementData.numeroTelephone = numeroTelephone;
    } else if (paymentMethod === "card") {
      paiementData.numeroCartePartiel = "**** **** **** 1234";
      paiementData.nomTitulaire = user?.nom || "Utilisateur";
    }

    // Validation
    const validation = validerDonneesPaiementIntelligent(paiementData);
    if (!validation.valide) {
      toast({
        title: "Erreur de validation",
        description: validation.erreurs[0],
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🔍 Prévisualisation du paiement...');
      const previewData = await previewPaiement(locataireId, paiementData);
      console.log('✅ Preview reçue:', previewData);
      setPreview(previewData);
      setShowPreview(true);
    } catch (error) {
      console.error('❌ Erreur preview:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirmer le paiement
  const handleConfirmPayment = async () => {
    const locataireId = getLocataireId();
    
    // Déterminer la méthode de paiement
    let methodePaiement;
    if (paymentMethod === "card") {
      methodePaiement = "VISA";
    } else if (paymentMethod === "mobile_money" && selectedMobileMoney) {
      methodePaiement = selectedMobileMoney.id;
    }

    const paiementData = {
      locationId: locationId,
      nombreMois: parseInt(nombreMois),
      montantMensuel: parseFloat(montantMensuel),
      methodePaiement: methodePaiement,
    };

    if (paymentMethod === "mobile_money") {
      paiementData.numeroTelephone = numeroTelephone;
    } else if (paymentMethod === "card") {
      paiementData.numeroCartePartiel = "**** **** **** 1234";
      paiementData.nomTitulaire = user?.nom || "Utilisateur";
    }

    setIsProcessing(true);
    try {
      console.log('💳 Confirmation du paiement...');
      const response = await effectuerPaiementIntelligent(locataireId, paiementData);
      console.log('✅ Paiement confirmé:', response);
      setPaiementResponse(response);
      setShowPreview(false);
      
      toast({
        title: "Paiement réussi ! 🎉",
        description: response.message,
        className: "bg-success text-white"
      });
    } catch (error) {
      console.error('❌ Erreur paiement:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setPaiementResponse(null);
    setShowPreview(false);
    setPreview(null);
    setNombreMois("");
    setMontantMensuel("");
    setPaymentMethod("card");
    setSelectedMobileMoney(null);
    setNumeroTelephone("");
  };

  // Afficher l'écran de succès
  if (paiementResponse) {
    return (
      <PaymentSuccess
        paiementResponse={paiementResponse}
        onBack={handleBack}
      />
    );
  }

  // Afficher la preview
  if (showPreview && preview) {
    return (
      <div className="max-w-2xl mx-auto">
        <PaymentPreview
          preview={preview}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowPreview(false)}
          isProcessing={isProcessing}
        />
      </div>
    );
  }

  // Afficher le loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  // Afficher une erreur si pas d'ID utilisateur
  if (!getLocataireId()) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-destructive/50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Erreur d'authentification</h3>
              <p className="text-muted-foreground">
                Impossible d'identifier votre compte. Veuillez vous reconnecter.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/login'}>
              Se reconnecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground mt-1">
          Payez plusieurs mois en une seule transaction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <Card className="lg:col-span-2 border-border/50 shadow-soft animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Euro className="w-5 h-5 text-secondary" />
              Détails du paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulaire simplifié */}
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Paiement intelligent</h3>
                    <p className="text-sm text-muted-foreground">
                      Indiquez le nombre de mois à payer. Les retards seront automatiquement couverts en priorité.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre de mois */}
                  <div className="space-y-2">
                    <Label htmlFor="nombreMois">
                      Nombre de mois <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombreMois"
                      type="number"
                      step="1"
                      min="1"
                      max="12"
                      placeholder="Ex: 3"
                      value={nombreMois}
                      onChange={(e) => setNombreMois(e.target.value)}
                      className="h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground">Entre 1 et 12 mois</p>
                  </div>

                  {/* Montant mensuel */}
                  <div className="space-y-2">
                    <Label htmlFor="montantMensuel">
                      Montant mensuel (FCFA) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="montantMensuel"
                      type="number"
                      step="1000"
                      min="0"
                      placeholder="Ex: 300000"
                      value={montantMensuel}
                      onChange={(e) => setMontantMensuel(e.target.value)}
                      className="h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground">Montant par mois</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Montant Total */}
            {montantTotal > 0 && (
              <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80">Montant total à payer</span>
                  <Badge className="bg-white/20 text-white hover:bg-white/30">
                    {nombreMois} mois
                  </Badge>
                </div>
                <p className="text-4xl font-bold">{formaterMontantFCFA(montantTotal)}</p>
                <p className="text-white/80 text-sm mt-2">
                  {formaterMontantFCFA(parseFloat(montantMensuel))} × {nombreMois} mois
                </p>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Méthode de paiement
              </h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {/* Carte Bancaire */}
                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Carte bancaire</p>
                      <p className="text-sm text-muted-foreground">
                        Visa, Mastercard
                      </p>
                    </div>
                  </Label>
                </div>

                {/* Mobile Money */}
                <div
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === "mobile_money"
                      ? "border-secondary bg-secondary/5"
                      : "border-border hover:border-secondary/50"
                  }`}
                  onClick={handleMobileMoneyClick}
                >
                  <RadioGroupItem value="mobile_money" id="mobile_money" />
                  <Label
                    htmlFor="mobile_money"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Mobile Money</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMobileMoney ? selectedMobileMoney.name : "Wave, Orange Money, Moov, MTN"}
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Champ numéro de téléphone pour Mobile Money */}
              {paymentMethod === "mobile_money" && selectedMobileMoney && (
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="tel">
                    Numéro de téléphone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tel"
                    type="tel"
                    placeholder="+225 XX XX XX XX XX"
                    value={numeroTelephone}
                    onChange={(e) => setNumeroTelephone(e.target.value)}
                    className="h-12"
                  />
                </div>
              )}
            </div>

            {/* Preview Button */}
            <Button
              onClick={handlePreview}
              disabled={isProcessing || montantTotal === 0}
              className="w-full h-14 text-lg bg-secondary hover:bg-secondary/90 shadow-glow transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Chargement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {montantTotal > 0 ? `Prévisualiser ${formaterMontantFCFA(montantTotal)}` : 'Prévisualiser'}
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Security & Stats */}
        <div className="space-y-6">
          {/* Security Info */}
          <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                Paiement sécurisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Vos informations sont protégées par un cryptage SSL 256 bits.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span>Transactions cryptées</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span>Données protégées</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  <span>Confirmation instantanée</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          {statistiques && (
            <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Vos paiements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total payé</span>
                  <span className="font-semibold">{formaterMontantFCFA(statistiques.totalPaye)}</span>
                </div>
                {statistiques.enRetard > 0 && (
                  <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                    <span className="text-sm text-destructive font-medium">En retard</span>
                    <span className="font-bold text-destructive">{formaterMontantFCFA(statistiques.enRetard)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Paiements effectués</span>
                  <span className="font-medium">{statistiques.nombrePaiementsEffectues}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Dialog Mobile Money */}
      <Dialog open={showMobileMoneyDialog} onOpenChange={setShowMobileMoneyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisissez votre fournisseur</DialogTitle>
            <DialogDescription>
              Sélectionnez le service Mobile Money que vous souhaitez utiliser
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {MOBILE_MONEY_OPTIONS.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleSelectMobileMoney(provider)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedMobileMoney?.id === provider.id
                    ? "border-secondary bg-secondary/5"
                    : "border-border hover:border-secondary/50"
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">{provider.icon}</div>
                  <p className="font-medium text-sm">{provider.name}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}