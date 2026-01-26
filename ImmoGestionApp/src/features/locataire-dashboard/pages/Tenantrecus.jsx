import { useEffect, useMemo, useState } from "react";
import { FileText, Download, CheckCircle2, Calendar } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/Table";

import { useAuth } from "../../../contexts/AuthContext";
import { getPaiementsByLocataire, telechargerRecu } from "../api/paiementLocataire";

export default function TenantRecus() {
  const { user, loading: authLoading } = useAuth();

  const [paiements, setPaiements] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true); // loading données page
  const [error, setError] = useState(null);
  const [downloadingAll, setDownloadingAll] = useState(false);

  // ID locataire robuste (selon ce que renvoie ton backend/auth)
  const locataireId = useMemo(() => {
    return user?.id ?? user?.userId ?? user?.locataireId ?? null;
  }, [user]);

  // Récupération des paiements
  useEffect(() => {
    if (authLoading) return;

    const fetchPaiements = async () => {
      setLoading(true);
      setError(null);

      if (!locataireId) {
        setError("ID du locataire non disponible.");
        setLoading(false);
        return;
      }

      try {
        const data = await getPaiementsByLocataire(locataireId);
        setPaiements(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, [authLoading, locataireId]);

  // Filtrer les paiements
  const filteredPaiements = useMemo(() => {
    return paiements.filter((paiement) => {
      const matchesYear =
        yearFilter === "all" ||
        new Date(paiement.dateEcheance).getFullYear() === parseInt(yearFilter, 10);

      const matchesStatus =
        statusFilter === "all" ||
        (paiement.statut || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesYear && matchesStatus;
    });
  }, [paiements, yearFilter, statusFilter]);

  // Badge statut
  const renderStatusBadge = (statut) => {
    const map = {
      PAYE: {
        className: "bg-success text-success-foreground",
        label: "Payé",
        icon: CheckCircle2,
      },
      EN_RETARD: {
        className: "bg-destructive text-destructive-foreground",
        label: "En retard",
        icon: Calendar,
      },
      EN_ATTENTE: {
        className: "bg-warning text-warning-foreground",
        label: "En attente",
        icon: Calendar,
      },
    };

    const cfg = map[statut] || {
      className: "bg-muted text-muted-foreground",
      label: statut || "Inconnu",
      icon: null,
    };

    const Icon = cfg.icon;
    return (
      <Badge className={cfg.className}>
        {Icon ? <Icon className="w-3 h-3 mr-1" /> : null}
        {cfg.label}
      </Badge>
    );
  };

  // Format date (mois + année)
  const formatMonthYear = (dateString) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  // Télécharger un reçu
  const handleTelechargerRecu = async (paiementId) => {
    if (!locataireId) {
      alert("ID du locataire non disponible.");
      return;
    }
    try {
      const blob = await telechargerRecu(paiementId, locataireId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recu_paiement_${paiementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Erreur lors du téléchargement: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
    }
  };

  // Télécharger tous les reçus PAYE
  const handleTelechargerTousRecus = async () => {
    if (!locataireId) {
      alert("ID du locataire non disponible.");
      return;
    }
    setDownloadingAll(true);
    try {
      for (const paiement of paiements) {
        if (paiement.statut === "PAYE") {
          const blob = await telechargerRecu(paiement.paiementId, locataireId);

          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `recu_paiement_${paiement.paiementId}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      alert(`Erreur lors du téléchargement des reçus: ${err instanceof Error ? err.message : "Erreur inconnue"}`);
    } finally {
      setDownloadingAll(false);
    }
  };

  // Stats
  const paiementsReussis = useMemo(
    () => paiements.filter((p) => p.statut === "PAYE").length,
    [paiements]
  );

  const paiementsRetard = useMemo(
    () => paiements.filter((p) => p.statut === "EN_RETARD").length,
    [paiements]
  );

  const totalPaye = useMemo(() => {
    return paiements.reduce((sum, p) => {
      const montant = Number(p.montant || 0);
      return p.statut === "PAYE" ? sum + montant : sum;
    }, 0);
  }, [paiements]);

  // UI states
  if (authLoading) {
    return <div className="max-w-6xl mx-auto space-y-6 p-6">Chargement utilisateur...</div>;
  }

  if (loading) {
    return <div className="max-w-6xl mx-auto space-y-6 p-6">Chargement des reçus...</div>;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        <div className="text-red-500">Erreur: {error}</div>
        <Button
          className="mt-4"
          onClick={() => {
            // refresh simple
            window.location.reload();
          }}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reçus et historique</h1>
          <p className="text-muted-foreground mt-1">
            Consultez et téléchargez vos quittances de loyer
          </p>
        </div>

        <Button
          className="bg-secondary hover:bg-secondary/90"
          onClick={handleTelechargerTousRecus}
          disabled={downloadingAll || paiements.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          {downloadingAll ? "Téléchargement..." : "Tout télécharger"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-soft animate-fade-up">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paiements réussis</p>
                <p className="text-2xl font-bold text-foreground">{paiementsReussis}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-100">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retards</p>
                <p className="text-2xl font-bold text-foreground">{paiementsRetard}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total payé</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalPaye.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            Historique des paiements
          </CardTitle>

          <div className="flex items-center gap-3">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="PAYE">Payé</SelectItem>
                <SelectItem value="EN_RETARD">En retard</SelectItem>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Mois</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPaiements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      Aucun paiement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPaiements.map((paiement, index) => (
                    <TableRow
                      key={paiement.paiementId}
                      className="hover:bg-muted/30 transition-colors animate-slide-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell className="font-medium">
                        {formatMonthYear(paiement.dateEcheance)}
                      </TableCell>

                      <TableCell>{Number(paiement.montant || 0).toLocaleString()} FCFA</TableCell>

                      <TableCell>
                        {paiement.datePaiement
                          ? formatMonthYear(paiement.datePaiement)
                          : "Non payé"}
                      </TableCell>

                      <TableCell>{renderStatusBadge(paiement.statut)}</TableCell>

                      <TableCell className="text-right">
                        {paiement.statut === "PAYE" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-secondary/10 hover:text-secondary"
                            onClick={() => handleTelechargerRecu(paiement.paiementId)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
