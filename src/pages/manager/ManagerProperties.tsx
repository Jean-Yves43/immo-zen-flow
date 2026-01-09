import { useState } from "react";
import { Home, Search, Filter, MapPin, Euro, Users, MoreHorizontal, Eye, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const properties = [
  { id: 1, name: "Apt T3 - Rue Victor Hugo", owner: "Pierre Martin", type: "Appartement", address: "Paris 1er", rent: 1200, status: "rented", tenant: "Jean Dupont" },
  { id: 2, name: "Studio - Rue Leclerc", owner: "Pierre Martin", type: "Studio", address: "Paris 15e", rent: 650, status: "vacant", tenant: null },
  { id: 3, name: "Maison T5 - Avenue Foch", owner: "Claire Durand", type: "Maison", address: "Paris 16e", rent: 3200, status: "rented", tenant: "Marie Lambert" },
  { id: 4, name: "T2 - Rue de la Paix", owner: "Paul Bernard", type: "Appartement", address: "Paris 2e", rent: 980, status: "for_sale", tenant: null },
  { id: 5, name: "Loft - Rue du Marais", owner: "Sophie Petit", type: "Loft", address: "Paris 4e", rent: 2100, status: "rented", tenant: "Lucas Petit" },
];

export default function ManagerProperties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "rented": return <Badge className="bg-secondary text-secondary-foreground">Loué</Badge>;
      case "vacant": return <Badge variant="outline">Vacant</Badge>;
      case "for_sale": return <Badge className="bg-primary text-primary-foreground">En vente</Badge>;
      default: return null;
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = ownerFilter === "all" || p.owner === ownerFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesOwner && matchesStatus;
  });

  const uniqueOwners = [...new Set(properties.map((p) => p.owner))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Biens</h1>
          <p className="text-muted-foreground mt-1">Tous les biens sous votre gestion</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total biens</CardTitle>
            <Home className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{properties.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Loués</CardTitle>
            <Users className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{properties.filter(p => p.status === "rented").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vacants</CardTitle>
            <Home className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{properties.filter(p => p.status === "vacant").length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus mensuels</CardTitle>
            <Euro className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{properties.filter(p => p.status === "rented").reduce((sum, p) => sum + p.rent, 0).toLocaleString()} €</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un bien..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[200px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Propriétaire" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les propriétaires</SelectItem>
                {uniqueOwners.map(owner => <SelectItem key={owner} value={owner}>{owner}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="rented">Loué</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="for_sale">En vente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bien</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Locataire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div><p className="font-medium">{property.name}</p><p className="text-sm text-muted-foreground">{property.type}</p></div>
                  </TableCell>
                  <TableCell>{property.owner}</TableCell>
                  <TableCell><div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{property.address}</div></TableCell>
                  <TableCell className="font-semibold">{property.rent} €</TableCell>
                  <TableCell>{property.tenant || "-"}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Voir détails</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Modifier</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
