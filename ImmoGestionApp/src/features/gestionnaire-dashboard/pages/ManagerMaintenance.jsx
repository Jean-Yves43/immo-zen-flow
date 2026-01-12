// src/features/gestionnaire-dashboard/pages/ManagerMaintenance.jsx
import { useState } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock, User, Home, Calendar } from "lucide-react";
import { Card, CardContent } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import { KpiCard } from "../components/KpiCard";
import { PageHeader } from "../components/PageHeader";
import { SearchFilterBar } from "../components/SearchFilterBar";
import { UrgencyBadge, MaintenanceStatusBadge } from "../components/StatusBadges";

const maintenanceRequests = [
  { id: 1, title: "Fuite robinet", property: "Apt T3 - Victor Hugo", owner: "Pierre Martin", tenant: "Jean Dupont", urgency: "medium", status: "in_progress", provider: "Plombier Express", createdAt: "10 Jan 2024" },
  { id: 2, title: "Panne chauffage", property: "Studio - Leclerc", owner: "Pierre Martin", tenant: "Marie Lambert", urgency: "high", status: "pending", provider: null, createdAt: "12 Jan 2024" },
  { id: 3, title: "Serrure porte", property: "Maison T5 - Foch", owner: "Claire Durand", tenant: "Paul Bernard", urgency: "low", status: "completed", provider: "Serrurier Pro", createdAt: "05 Jan 2024" },
  { id: 4, title: "Volet bloqué", property: "T2 - Paix", owner: "Paul Bernard", tenant: "Sophie Martin", urgency: "low", status: "assigned", provider: "Multi-Services", createdAt: "08 Jan 2024" },
];

export default function ManagerMaintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = maintenanceRequests.filter((r) => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const kpiData = [
    { 
      title: "En attente", 
      value: maintenanceRequests.filter(r => r.status === "pending").length,
      icon: AlertTriangle,
      valueColor: "text-orange-500"
    },
    { 
      title: "En cours", 
      value: maintenanceRequests.filter(r => r.status === "in_progress" || r.status === "assigned").length,
      icon: Wrench
    },
    { 
      title: "Terminées", 
      value: maintenanceRequests.filter(r => r.status === "completed").length,
      icon: CheckCircle,
      valueColor: "text-secondary"
    },
    { 
      title: "Urgentes", 
      value: maintenanceRequests.filter(r => r.urgency === "high").length,
      icon: AlertTriangle,
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
        { value: "pending", label: "En attente" },
        { value: "assigned", label: "Assigné" },
        { value: "in_progress", label: "En cours" },
        { value: "completed", label: "Terminé" }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Maintenance"
        description="Toutes les demandes de maintenance"
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
        placeholder="Rechercher..."
      />

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{request.title}</h3>
                    <UrgencyBadge urgency={request.urgency} />
                    <MaintenanceStatusBadge status={request.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      {request.property}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {request.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {request.createdAt}
                    </span>
                  </div>
                  {request.provider && (
                    <div className="flex items-center gap-2 pt-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {request.provider[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{request.provider}</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">Voir détails</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}