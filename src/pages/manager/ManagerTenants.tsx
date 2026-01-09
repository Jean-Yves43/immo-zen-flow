import { useState } from "react";
import { Users, Search, Filter, Home, Mail, MoreHorizontal, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const tenants = [
  { id: 1, name: "Jean Dupont", email: "jean@email.com", property: "Apt T3 - Victor Hugo", owner: "Pierre Martin", rent: 1200, status: "paid" },
  { id: 2, name: "Marie Lambert", email: "marie@email.com", property: "Studio - Leclerc", owner: "Pierre Martin", rent: 650, status: "late" },
  { id: 3, name: "Paul Bernard", email: "paul@email.com", property: "Maison T5 - Foch", owner: "Claire Durand", rent: 3200, status: "paid" },
  { id: 4, name: "Sophie Martin", email: "sophie@email.com", property: "T2 - Paix", owner: "Paul Bernard", rent: 980, status: "pending" },
  { id: 5, name: "Lucas Petit", email: "lucas@email.com", property: "Loft - Marais", owner: "Sophie Petit", rent: 2100, status: "paid" },
];

export default function ManagerTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-secondary text-secondary-foreground">Payé</Badge>;
      case "late": return <Badge variant="destructive">En retard</Badge>;
      case "pending": return <Badge variant="outline">En attente</Badge>;
      default: return null;
    }
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Locataires</h1>
        <p className="text-muted-foreground mt-1">Tous les locataires sous votre gestion</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Total locataires</CardTitle><Users className="h-5 w-5 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{tenants.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Paiements à jour</CardTitle><Users className="h-5 w-5 text-secondary" /></CardHeader><CardContent><div className="text-2xl font-bold text-secondary">{tenants.filter(t => t.status === "paid").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Retards</CardTitle><Users className="h-5 w-5 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{tenants.filter(t => t.status === "late").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="paid">Payé</SelectItem><SelectItem value="pending">En attente</SelectItem><SelectItem value="late">En retard</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Locataire</TableHead><TableHead>Bien</TableHead><TableHead>Propriétaire</TableHead><TableHead>Loyer</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell><div className="flex items-center gap-3"><Avatar><AvatarFallback className="bg-primary text-primary-foreground">{tenant.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar><div><p className="font-medium">{tenant.name}</p><p className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{tenant.email}</p></div></div></TableCell>
                  <TableCell><div className="flex items-center gap-1"><Home className="h-4 w-4 text-muted-foreground" />{tenant.property}</div></TableCell>
                  <TableCell>{tenant.owner}</TableCell>
                  <TableCell className="font-semibold">{tenant.rent} €</TableCell>
                  <TableCell>{getPaymentBadge(tenant.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end"><DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Voir profil</DropdownMenuItem><DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" />Contacter</DropdownMenuItem></DropdownMenuContent>
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
