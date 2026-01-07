import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  Filter,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const receipts = [
  {
    id: 1,
    month: "Janvier 2024",
    amount: "850,00 €",
    paymentDate: "02/01/2024",
    status: "paid",
  },
  {
    id: 2,
    month: "Décembre 2023",
    amount: "850,00 €",
    paymentDate: "01/12/2023",
    status: "paid",
  },
  {
    id: 3,
    month: "Novembre 2023",
    amount: "850,00 €",
    paymentDate: "01/11/2023",
    status: "paid",
  },
  {
    id: 4,
    month: "Octobre 2023",
    amount: "850,00 €",
    paymentDate: "01/10/2023",
    status: "paid",
  },
  {
    id: 5,
    month: "Septembre 2023",
    amount: "850,00 €",
    paymentDate: "04/09/2023",
    status: "late",
  },
  {
    id: 6,
    month: "Août 2023",
    amount: "850,00 €",
    paymentDate: "01/08/2023",
    status: "paid",
  },
];

export default function TenantRecus() {
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesYear =
      yearFilter === "all" || receipt.month.includes(yearFilter);
    const matchesStatus =
      statusFilter === "all" || receipt.status === statusFilter;
    return matchesYear && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Payé
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning/10 text-warning border-warning/20">
        Payé en retard
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Reçus et historique
          </h1>
          <p className="text-muted-foreground mt-1">
            Consultez et téléchargez vos quittances de loyer
          </p>
        </div>
        <Button className="bg-secondary hover:bg-secondary-light">
          <Download className="w-4 h-4 mr-2" />
          Tout télécharger
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
                <p className="text-2xl font-bold text-foreground">5</p>
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
                <p className="text-2xl font-bold text-foreground">1</p>
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
                <p className="text-2xl font-bold text-foreground">5 100 €</p>
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
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
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
                {filteredReceipts.map((receipt, index) => (
                  <TableRow
                    key={receipt.id}
                    className="hover:bg-muted/30 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium">
                      {receipt.month}
                    </TableCell>
                    <TableCell>{receipt.amount}</TableCell>
                    <TableCell>{receipt.paymentDate}</TableCell>
                    <TableCell>{getStatusBadge(receipt.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-secondary/10 hover:text-secondary"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
