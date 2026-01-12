// src/features/gestionnaire-dashboard/pages/ManagerProperties.jsx
import { useState } from "react";
import { Home, Users, Euro, MapPin, MoreHorizontal, Eye, Edit } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/Table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/DropdownMenu";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { PropertyStatusBadge } from "../components/StatusBadges";

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

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOwner = ownerFilter === "all" || p.owner === ownerFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesOwner && matchesStatus;
  });

  const uniqueOwners = [...new Set(properties.map((p) => p.owner))];

  const kpiData = [
    { 
      title: "Total biens", 
      value: properties.length,
      icon: Home
    },
    { 
      title: "Loués", 
      value: properties.filter(p => p.status === "rented").length,
      icon: Users,
      valueColor: "text-secondary"
    },
    { 
      title: "Vacants", 
      value: properties.filter(p => p.status === "vacant").length,
      icon: Home
    },
    { 
      title: "Revenus mensuels", 
      value: `${properties.filter(p => p.status === "rented").reduce((sum, p) => sum + p.rent, 0).toLocaleString()} €`,
      icon: Euro,
      valueColor: "text-secondary"
    },
  ];

  const filterOptions = [
    {
      value: ownerFilter,
      onChange: setOwnerFilter,
      placeholder: "Propriétaire",
      showIcon: true,
      width: "w-[200px]",
      options: [
        { value: "all", label: "Tous les propriétaires" },
        ...uniqueOwners.map(owner => ({ value: owner, label: owner }))
      ]
    },
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Statut",
      width: "w-[150px]",
      options: [
        { value: "all", label: "Tous" },
        { value: "rented", label: "Loué" },
        { value: "vacant", label: "Vacant" },
        { value: "for_sale", label: "En vente" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Biens"
        description="Tous les biens sous votre gestion"
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
        placeholder="Rechercher un bien..."
      />

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
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-muted-foreground">{property.type}</p>
                    </div>
                  </TableCell>
                  <TableCell>{property.owner}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {property.address}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{property.rent} €</TableCell>
                  <TableCell>{property.tenant || "-"}</TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={property.status} />
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
                          Voir détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
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