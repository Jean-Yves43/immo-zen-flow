import { useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  Download,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const payments = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    amount: 1200,
    dueDate: "01 Jan 2024",
    paidDate: "02 Jan 2024",
    status: "paid",
    method: "Virement",
  },
  {
    id: 2,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    amount: 650,
    dueDate: "01 Jan 2024",
    paidDate: null,
    status: "late",
    method: null,
  },
  {
    id: 3,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    amount: 3200,
    dueDate: "01 Jan 2024",
    paidDate: "01 Jan 2024",
    status: "paid",
    method: "Prélèvement",
  },
  {
    id: 4,
    tenant: "Sophie Martin",
    property: "T2 - Rue de la Paix",
    amount: 980,
    dueDate: "15 Jan 2024",
    paidDate: null,
    status: "pending",
    method: null,
  },
  {
    id: 5,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    amount: 2100,
    dueDate: "01 Jan 2024",
    paidDate: "01 Jan 2024",
    status: "paid",
    method: "Virement",
  },
  {
    id: 6,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    amount: 1200,
    dueDate: "01 Dec 2023",
    paidDate: "01 Dec 2023",
    status: "paid",
    method: "Virement",
  },
  {
    id: 7,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    amount: 650,
    dueDate: "01 Dec 2023",
    paidDate: "05 Dec 2023",
    status: "paid",
    method: "Virement",
  },
];

export default function OwnerPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Payé
          </Badge>
        );
      case "late":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paiements & Loyers</h1>
          <p className="text-muted-foreground mt-1">
            Suivez tous vos paiements de loyer
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus ce mois
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {totalRevenue.toLocaleString()} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAmount.toLocaleString()} €</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En retard
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {lateAmount.toLocaleString()} €
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taux de recouvrement
            </CardTitle>
            <CreditCard className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un paiement..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Bell className="mr-2 h-4 w-4" />
              Envoyer rappels
            </Button>
          </div>
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
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
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
