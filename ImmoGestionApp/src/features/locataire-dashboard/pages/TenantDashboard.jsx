// src/features/locataire-dashboard/pages/TenantDashboard.jsx

import { useState, useEffect } from "react";
import {
  Euro,
  Calendar,
  Home,
  Bell,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getHistoriquePaiements, getStatistiquesPaiement } from "../api/paiementLocataire";
import { getBiensLouesByLocataire } from "../api/bienLoueService";
import { useNotifications } from "../../../hooks/useNotifications";

const iconMap = {
  Euro,
  Calendar,
  Home,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
};

// ===== Utils =====
const formaterMontantFCFA = (montant) => {
  if (montant === null || montant === undefined) return "0 FCFA";
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + " FCFA"
  );
};

const getPaymentStatusBadge = (paiement) => {
  const aujourdHui = new Date();

  if (paiement?.datePaiement) {
    return {
      label: "Payé",
      className: "bg-success/10 text-success border-success/20",
      icon: "CheckCircle2",
    };
  }

  const echeance = new Date(paiement?.dateEcheance);
  if (echeance < aujourdHui) {
    return {
      label: "En retard",
      className: "bg-destructive/10 text-destructive border-destructive/20",
      icon: "AlertCircle",
    };
  }

  return {
    label: "À venir",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: "Clock",
  };
};

// ===== UI States =====
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto" />
      <div>
        <p className="text-lg font-medium text-foreground">Chargement...</p>
        <p className="text-sm text-muted-foreground">Récupération de vos données</p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }) => (
  <Card className="border-destructive/50">
    <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <XCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {error || "Une erreur s'est produite lors du chargement de vos données."}
      </p>
      <Button onClick={onRetry} variant="outline">
        Réessayer
      </Button>
    </CardContent>
  </Card>
);

// ===== Badge KPI =====
const getKpiBadgeClass = (statusColor) => {
  if (statusColor === "success") return "bg-success/10 text-success border-success/20";
  if (statusColor === "warning") return "bg-warning/10 text-warning border-warning/20";
  if (statusColor === "destructive") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground border-border";
};

// ===== Page =====
export default function TenantDashboard() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentPaiements, setRecentPaiements] = useState([]);
  const [biensLoues, setBiensLoues] = useState([]);

  const { unreadCount: notificationsNonLues } = useNotifications(userId);

  useEffect(() => {
    const chargerDonnees = async () => {
      if (authLoading) return;

      if (!userId) {
        setError("Utilisateur non identifié");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Chargement des données pour userId:', userId);

        // 1) Biens loués
        const biens = await getBiensLouesByLocataire(userId);
        console.log('✅ Biens loués:', biens);
        setBiensLoues(biens || []);

        if (!biens || biens.length === 0) {
          setError("Aucun bien loué trouvé");
          setRecentPaiements([]);
          return;
        }

        // Utiliser bienId comme locationId
        const premierBien = biens[0];
        const locId = premierBien.bienId;
        console.log('🔑 Using bienId as locationId:', locId);

        if (!locId) {
          setError("Impossible de déterminer l'ID du bien");
          return;
        }

        // 2) Paiements (on ne charge QUE l'historique, pas les stats)
        const historique = await getHistoriquePaiements(userId, locId);
        console.log('✅ Historique des paiements:', historique);
        
        const derniersPaiements = (historique || [])
          .sort((a, b) => new Date(b.dateEcheance) - new Date(a.dateEcheance))
          .slice(0, 5);

        setRecentPaiements(derniersPaiements);
        console.log('📊 Derniers paiements affichés:', derniersPaiements);

      } catch (err) {
        console.error("❌ Erreur chargement dashboard:", err);
        setError(err?.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    chargerDonnees();
  }, [authLoading, userId]);

  const formaterDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  const obtenirMois = (paiement) => {
    if (paiement?.motif && paiement.motif.includes("Loyer")) return paiement.motif;
    const date = new Date(paiement?.dateEcheance);
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  const renderStatusBadge = (paiement) => {
    const badgeConfig = getPaymentStatusBadge(paiement);
    if (!badgeConfig) return null;

    const Icon = iconMap[badgeConfig.icon];
    return (
      <Badge className={badgeConfig.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {badgeConfig.label}
      </Badge>
    );
  };

  // ✅ CALCUL MANUEL DES STATISTIQUES (plus fiable)
  const aujourdHui = new Date();
  
  // Paiements en retard (non payés avec échéance passée)
  const paiementsEnRetard = recentPaiements.filter(p => {
    if (p.datePaiement) return false; // Déjà payé
    const echeance = new Date(p.dateEcheance);
    return echeance < aujourdHui;
  });
  
  const montantEnRetard = paiementsEnRetard.reduce((sum, p) => sum + (p.montant || 0), 0);
  
  // Prochain paiement à venir (non payé avec échéance future)
  const prochainPaiement = recentPaiements
    .filter(p => !p.datePaiement && new Date(p.dateEcheance) >= aujourdHui)
    .sort((a, b) => new Date(a.dateEcheance) - new Date(b.dateEcheance))[0];
  
  // Loyer mensuel : utiliser le montant du premier paiement OU prixApt
  const loyerMensuel = recentPaiements[0]?.montant || biensLoues[0]?.prixApt || 0;

  console.log('📈 KPI Calculés:', {
    loyerMensuel,
    montantEnRetard,
    prochainPaiement: prochainPaiement?.dateEcheance,
    notificationsNonLues
  });

  if (authLoading || loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  const kpiCards = [
    {
      title: "Loyer mensuel",
      value: formaterMontantFCFA(loyerMensuel),
      status: loyerMensuel > 0 ? "Montant mensuel" : "Non défini",
      statusColor: loyerMensuel > 0 ? "success" : "warning",
      icon: "Euro",
      iconColor: "bg-primary/10 text-primary",
    },
    {
      title: "Prochaine échéance",
      value: prochainPaiement ? formaterDate(prochainPaiement.dateEcheance) : "Aucune",
      status: prochainPaiement ? formaterMontantFCFA(prochainPaiement.montant) : "À jour",
      statusColor: prochainPaiement ? "warning" : "success",
      icon: "Calendar",
      iconColor: "bg-secondary/10 text-secondary",
    },
    {
      title: "En retard",
      value: formaterMontantFCFA(montantEnRetard),
      status: montantEnRetard > 0 ? `${paiementsEnRetard.length} paiement(s)` : "Aucun retard",
      statusColor: montantEnRetard > 0 ? "destructive" : "success",
      icon: "AlertCircle",
      iconColor:
        montantEnRetard > 0
          ? "bg-destructive/10 text-destructive"
          : "bg-success/10 text-success",
    },
    {
      title: "Notifications",
      value: notificationsNonLues || 0,
      status: notificationsNonLues > 0 ? "Non lues" : "Aucune",
      statusColor: notificationsNonLues > 0 ? "warning" : "muted",
      icon: "Bell",
      iconColor: "bg-warning/10 text-warning",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bonjour, {user?.nom || "Locataire"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Voici un aperçu de votre situation locative</p>
        </div>

        <Button asChild className="bg-secondary hover:bg-secondary-light text-white">
          <Link to="/tenant/paiements">
            <Euro className="w-4 h-4 mr-2" />
            Payer mon loyer
          </Link>
        </Button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = iconMap[card.icon];
          return (
            <Card key={card.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                    <Badge variant="outline" className={getKpiBadgeClass(card.statusColor)}>
                      {card.status}
                    </Badge>
                  </div>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                    {Icon && <Icon className="w-6 h-6" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Historique */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Historique des paiements
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/tenant/recus">Voir tout</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {recentPaiements.length > 0 ? (
            <div className="space-y-4">
              {recentPaiements.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Euro className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{obtenirMois(payment)}</p>
                      <p className="text-sm text-muted-foreground">
                        Échéance: {formaterDate(payment.dateEcheance)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-foreground">
                      {formaterMontantFCFA(payment.montant)}
                    </span>
                    {renderStatusBadge(payment)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Euro className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">Aucun paiement enregistré</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logement */}
      {biensLoues.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Home className="w-5 h-5 text-secondary" />
              Mon logement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {biensLoues.slice(0, 3).map((bien) => (
                <div key={bien.bienId} className="p-4 rounded-xl border-2 border-border hover:border-secondary/50 transition-all">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">
                      {bien.ref || `Bien #${bien.bienId}`}
                    </p>
                    {bien.typeBienLibelle && (
                      <Badge variant="outline" className="text-xs">
                        {bien.typeBienLibelle}
                      </Badge>
                    )}
                    {bien.quartierNom && bien.communeNom && (
                      <p className="text-sm text-muted-foreground">
                        {bien.quartierNom}, {bien.communeNom}
                      </p>
                    )}
                    {bien.prixApt && (
                      <p className="text-sm font-medium text-secondary">
                        {formaterMontantFCFA(bien.prixApt)}/mois
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}