import { useState } from "react";
import {
  CreditCard,
  Download,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchAndFilter from "../components/Searchandfilter";
import { payments, getStatusBadge, filterItems } from "../api/owner";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "paid", label: "Payé" },
  { value: "pending", label: "En attente" },
  { value: "late", label: "En retard" },
];

const iconMap = {
  CheckCircle,
  AlertTriangle,
  Clock,
};

export default function OwnerPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const renderStatusBadge = (status) => {
    const badgeConfig = getStatusBadge(status, "payment");
    if (!badgeConfig) return null;
    
    const Icon = iconMap[badgeConfig.icon];
    return (
      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
        {Icon && <Icon className="h-3 w-3 mr-1" />}
        {badgeConfig.label}
      </Badge>
    );
  };

  const filteredPayments = filterItems(
    payments,
    searchQuery,
    ["tenant", "property"],
    statusFilter
  );

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const lateAmount = payments
    .filter((p) => p.status === "late")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Paiements & Loyers"
        description="Suivez tous vos paiements de loyer"
        action={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Revenus ce mois"
          value={`${totalRevenue.toLocaleString()} €`}
          icon={TrendingUp}
          valueClassName="text-secondary"
        />
        <StatCard
          title="En attente"
          value={`${pendingAmount.toLocaleString()} €`}
          icon={Clock}
        />
        <StatCard
          title="En retard"
          value={`${lateAmount.toLocaleString()} €`}
          icon={AlertTriangle}
          valueClassName="text-destructive"
        />
        <StatCard
          title="Taux de recouvrement"
          value="92%"
          icon={CreditCard}
        />
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            placeholder="Rechercher un paiement..."
          >
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Bell className="mr-2 h-4 w-4" />
              Envoyer rappels
            </Button>
          </SearchAndFilter>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.tenant}</TableCell>
                  <TableCell>{payment.property}</TableCell>
                  <TableCell className="font-semibold">{payment.amount} €</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>{payment.paidDate || "-"}</TableCell>
                  <TableCell>{payment.method || "-"}</TableCell>
                  <TableCell>{renderStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    {payment.status === "paid" ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Reçu
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-1" />
                        Relancer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}