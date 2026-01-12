import { useState } from "react";
import {
  Users,
  MoreHorizontal,
  Mail,
  Phone,
  Home,
  FileText,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
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
import { tenants, filterItems } from "../api/owner";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "paid", label: "Payé" },
  { value: "pending", label: "En attente" },
  { value: "late", label: "En retard" },
];

export default function OwnerTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getPaymentBadge = (status) => {
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

  const filteredTenants = filterItems(
    tenants,
    searchQuery,
    ["name", "property"],
    statusFilter,
    "paymentStatus"
  );

  const totalTenants = tenants.length;
  const paidCount = tenants.filter((t) => t.paymentStatus === "paid").length;
  const lateCount = tenants.filter((t) => t.paymentStatus === "late").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Mes locataires"
        description={`Gérez vos ${totalTenants} locataires`}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total locataires"
          value={totalTenants}
          icon={Users}
        />
        <StatCard
          title="Paiements à jour"
          value={paidCount}
          icon={Users}
          valueClassName="text-secondary"
        />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Retards de paiement
                </p>
                <div className="text-2xl font-bold text-destructive">{lateCount}</div>
              </div>
              <Users className="h-5 w-5 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            statusOptions={statusOptions}
            placeholder="Rechercher un locataire..."
          />
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