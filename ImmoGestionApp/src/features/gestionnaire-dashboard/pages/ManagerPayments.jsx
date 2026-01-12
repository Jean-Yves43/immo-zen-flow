// src/features/gestionnaire-dashboard/pages/ManagerPayments.jsx
import { useState } from "react";
import { CreditCard, Download, TrendingUp, AlertTriangle, Clock, Bell } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { PaymentStatusBadge } from "../components/StatusBadges";

const payments = [
  { id: 1, tenant: "Jean Dupont", owner: "Pierre Martin", property: "Apt T3 - Victor Hugo", amount: 1200, dueDate: "01 Jan 2024", status: "paid" },
  { id: 2, tenant: "Marie Lambert", owner: "Pierre Martin", property: "Studio - Leclerc", amount: 650, dueDate: "01 Jan 2024", status: "late" },
  { id: 3, tenant: "Paul Bernard", owner: "Claire Durand", property: "Maison T5 - Foch", amount: 3200, dueDate: "01 Jan 2024", status: "paid" },
  { id: 4, tenant: "Sophie Martin", owner: "Paul Bernard", property: "T2 - Paix", amount: 980, dueDate: "15 Jan 2024", status: "pending" },
  { id: 5, tenant: "Lucas Petit", owner: "Sophie Petit", property: "Loft - Marais", amount: 2100, dueDate: "01 Jan 2024", status: "paid" },
];

export default function ManagerPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.tenant.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const lateAmount = payments
    .filter(p => p.status === "late")
    .reduce((sum, p) => sum + p.amount, 0);

  const kpiData = [
    { 
      title: "Revenus ce mois", 
      value: `${totalRevenue.toLocaleString()} €`,
      icon: TrendingUp,
      valueColor: "text-secondary"
    },
    { 
      title: "En retard", 
      value: `${lateAmount.toLocaleString()} €`,
      icon: AlertTriangle,
      valueColor: "text-destructive"
    },
    { 
      title: "Taux de recouvrement", 
      value: "87%",
      icon: CreditCard
    },
    { 
      title: "Paiements en attente", 
      value: payments.filter(p => p.status === "pending").length,
      icon: Clock
    },
  ];

  const filterOptions = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Statut",
      showIcon: true,
      options: [
        { value: "all", label: "Tous" },
        { value: "paid", label: "Payé" },
        { value: "pending", label: "En attente" },
        { value: "late", label: "En retard" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Paiements"
        description="Suivi de tous les paiements"
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Bell className="mr-2 h-4 w-4" />
              Envoyer rappels
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {kpiData.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterOptions}
        placeholder="Rechercher..."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.tenant}</TableCell>
                  <TableCell>{payment.owner}</TableCell>
                  <TableCell>{payment.property}</TableCell>
                  <TableCell className="font-semibold">{payment.amount} €</TableCell>
                  <TableCell>{payment.dueDate}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
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