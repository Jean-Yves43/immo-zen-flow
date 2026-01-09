import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  File,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const receipts = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    month: "Janvier 2024",
    amount: 1200,
    date: "02 Jan 2024",
    type: "receipt",
  },
  {
    id: 2,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    month: "Janvier 2024",
    amount: 3200,
    date: "01 Jan 2024",
    type: "receipt",
  },
  {
    id: 3,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    month: "Janvier 2024",
    amount: 2100,
    date: "01 Jan 2024",
    type: "receipt",
  },
  {
    id: 4,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    month: "Décembre 2023",
    amount: 1200,
    date: "01 Dec 2023",
    type: "receipt",
  },
  {
    id: 5,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    month: "Décembre 2023",
    amount: 650,
    date: "05 Dec 2023",
    type: "receipt",
  },
];

const contracts = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    startDate: "01 Jan 2023",
    endDate: "31 Dec 2024",
    status: "active",
    type: "contract",
  },
  {
    id: 2,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    startDate: "01 Jul 2023",
    endDate: "30 Jun 2024",
    status: "expiring",
    type: "contract",
  },
  {
    id: 3,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    startDate: "01 Apr 2023",
    endDate: "31 Mar 2025",
    status: "active",
    type: "contract",
  },
  {
    id: 4,
    tenant: "Sophie Martin",
    property: "T2 - Rue de la Paix",
    startDate: "15 Sep 2023",
    endDate: "15 Sep 2024",
    status: "active",
    type: "contract",
  },
  {
    id: 5,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    startDate: "01 Mar 2023",
    endDate: "28 Feb 2025",
    status: "active",
    type: "contract",
  },
];

export default function OwnerReceipts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("2024");

  const getContractBadge = (status: string) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reçus & Contrats</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos documents de location
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reçus générés
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un reçu..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Tout télécharger
                </Button>
              </div>
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
