import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  File,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import SearchAndFilter from "../components/Searchandfilter";
import { receipts, contracts } from "../api/owner";

export default function OwnerReceipts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("2024");

  const getContractBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-secondary text-secondary-foreground">Actif</Badge>;
      case "expiring":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Expire bientôt</Badge>;
      case "expired":
        return <Badge variant="destructive">Expiré</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Reçus & Contrats"
        description="Gérez vos documents de location"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Reçus générés"
          value={receipts.length}
          icon={FileText}
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contrats actifs
            </CardTitle>
            <File className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              {contracts.filter((c) => c.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contrats à renouveler
            </CardTitle>
            <Calendar className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {contracts.filter((c) => c.status === "expiring").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="receipts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="receipts">Reçus de loyer</TabsTrigger>
          <TabsTrigger value="contracts">Contrats</TabsTrigger>
        </TabsList>

        <TabsContent value="receipts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <SearchAndFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={yearFilter}
                onStatusChange={setYearFilter}
                statusOptions={[
                  { value: "2024", label: "2024" },
                  { value: "2023", label: "2023" },
                  { value: "2022", label: "2022" },
                ]}
                placeholder="Rechercher un reçu..."
              >
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Tout télécharger
                </Button>
              </SearchAndFilter>
            </CardContent>
          </Card>

          {/* Receipts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locataire</TableHead>
                    <TableHead>Bien</TableHead>
                    <TableHead>Mois</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date de paiement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.tenant}</TableCell>
                      <TableCell>{receipt.property}</TableCell>
                      <TableCell>{receipt.month}</TableCell>
                      <TableCell className="font-semibold">{receipt.amount} €</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          {/* Contracts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Locataire</TableHead>
                    <TableHead>Bien</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.tenant}</TableCell>
                      <TableCell>{contract.property}</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>{getContractBadge(contract.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}