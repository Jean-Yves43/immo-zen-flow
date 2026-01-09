import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Home,
  FileText,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const tenants = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78",
    property: "Apt T3 - Rue Victor Hugo",
    rent: 1200,
    paymentStatus: "paid",
    leaseEnd: "31 Dec 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Marie Lambert",
    email: "marie.lambert@email.com",
    phone: "06 23 45 67 89",
    property: "Studio - Rue Leclerc",
    rent: 650,
    paymentStatus: "late",
    leaseEnd: "30 Jun 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Paul Bernard",
    email: "paul.bernard@email.com",
    phone: "06 34 56 78 90",
    property: "Maison T5 - Avenue Foch",
    rent: 3200,
    paymentStatus: "paid",
    leaseEnd: "31 Mar 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    phone: "06 45 67 89 01",
    property: "T2 - Rue de la Paix",
    rent: 980,
    paymentStatus: "pending",
    leaseEnd: "15 Sep 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Lucas Petit",
    email: "lucas.petit@email.com",
    phone: "06 56 78 90 12",
    property: "Loft - Rue du Marais",
    rent: 2100,
    paymentStatus: "paid",
    leaseEnd: "28 Feb 2025",
    avatar: "/placeholder.svg",
  },
];

export default function OwnerTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-secondary text-secondary-foreground">Payé</Badge>;
      case "late":
        return <Badge variant="destructive">En retard</Badge>;
      case "pending":
        return <Badge variant="outline">En attente</Badge>;
      default:
        return null;
    }
  };

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || tenant.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalTenants = tenants.length;
  const paidCount = tenants.filter((t) => t.paymentStatus === "paid").length;
  const lateCount = tenants.filter((t) => t.paymentStatus === "late").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mes locataires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos {totalTenants} locataires
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total locataires
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTenants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements à jour
            </CardTitle>
            <Users className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retards de paiement
            </CardTitle>
            <Users className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lateCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un locataire..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Statut paiement</TableHead>
                <TableHead>Fin de bail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={tenant.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {tenant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {tenant.property}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{tenant.rent} €</TableCell>
                  <TableCell>{getPaymentBadge(tenant.paymentStatus)}</TableCell>
                  <TableCell>{tenant.leaseEnd}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contacter
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir le contrat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </DropdownMenuItem>
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
