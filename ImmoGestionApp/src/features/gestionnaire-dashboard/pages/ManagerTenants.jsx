// src/features/gestionnaire-dashboard/pages/ManagerTenants.jsx
import { useState } from "react";
import { Users, Home, Mail, MoreHorizontal, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/DropdownMenu";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { PaymentStatusBadge } from "../components/StatusBadges";

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

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiData = [
    { 
      title: "Total locataires", 
      value: tenants.length,
      icon: Users
    },
    { 
      title: "Paiements à jour", 
      value: tenants.filter(t => t.status === "paid").length,
      icon: Users,
      valueColor: "text-secondary"
    },
    { 
      title: "Retards", 
      value: tenants.filter(t => t.status === "late").length,
      icon: Users,
      valueColor: "text-destructive"
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
        title="Locataires"
        description="Tous les locataires sous votre gestion"
      />

      <div className="grid gap-4 md:grid-cols-3">
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
                <TableHead>Bien</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {tenant.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {tenant.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      {tenant.property}
                    </div>
                  </TableCell>
                  <TableCell>{tenant.owner}</TableCell>
                  <TableCell className="font-semibold">{tenant.rent} €</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={tenant.status} />
                  </TableCell>
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
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contacter
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