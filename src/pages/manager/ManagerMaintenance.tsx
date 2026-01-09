import { useState } from "react";
import { Wrench, Search, Filter, Clock, CheckCircle, AlertTriangle, User, Home, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const maintenanceRequests = [
  { id: 1, title: "Fuite robinet", property: "Apt T3 - Victor Hugo", owner: "Pierre Martin", tenant: "Jean Dupont", urgency: "medium", status: "in_progress", provider: "Plombier Express", createdAt: "10 Jan 2024" },
  { id: 2, title: "Panne chauffage", property: "Studio - Leclerc", owner: "Pierre Martin", tenant: "Marie Lambert", urgency: "high", status: "pending", provider: null, createdAt: "12 Jan 2024" },
  { id: 3, title: "Serrure porte", property: "Maison T5 - Foch", owner: "Claire Durand", tenant: "Paul Bernard", urgency: "low", status: "completed", provider: "Serrurier Pro", createdAt: "05 Jan 2024" },
  { id: 4, title: "Volet bloqué", property: "T2 - Paix", owner: "Paul Bernard", tenant: "Sophie Martin", urgency: "low", status: "assigned", provider: "Multi-Services", createdAt: "08 Jan 2024" },
];

export default function ManagerMaintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high": return <Badge variant="destructive">Urgent</Badge>;
      case "medium": return <Badge variant="outline" className="border-orange-500 text-orange-500">Moyen</Badge>;
      case "low": return <Badge variant="outline">Faible</Badge>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />En attente</Badge>;
      case "assigned": return <Badge className="bg-primary text-primary-foreground"><User className="h-3 w-3 mr-1" />Assigné</Badge>;
      case "in_progress": return <Badge variant="outline" className="border-orange-500 text-orange-500"><Wrench className="h-3 w-3 mr-1" />En cours</Badge>;
      case "completed": return <Badge className="bg-secondary text-secondary-foreground"><CheckCircle className="h-3 w-3 mr-1" />Terminé</Badge>;
      default: return null;
    }
  };

  const filteredRequests = maintenanceRequests.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.property.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-3xl font-bold text-foreground">Maintenance</h1><p className="text-muted-foreground mt-1">Toutes les demandes de maintenance</p></div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">En attente</CardTitle><AlertTriangle className="h-5 w-5 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-500">{maintenanceRequests.filter(r => r.status === "pending").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">En cours</CardTitle><Wrench className="h-5 w-5 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{maintenanceRequests.filter(r => r.status === "in_progress" || r.status === "assigned").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Terminées</CardTitle><CheckCircle className="h-5 w-5 text-secondary" /></CardHeader><CardContent><div className="text-2xl font-bold text-secondary">{maintenanceRequests.filter(r => r.status === "completed").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">Urgentes</CardTitle><AlertTriangle className="h-5 w-5 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">{maintenanceRequests.filter(r => r.urgency === "high").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Rechercher..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Statut" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Tous</SelectItem><SelectItem value="pending">En attente</SelectItem><SelectItem value="assigned">Assigné</SelectItem><SelectItem value="in_progress">En cours</SelectItem><SelectItem value="completed">Terminé</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{request.title}</h3>
                    {getUrgencyBadge(request.urgency)}
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Home className="h-4 w-4" />{request.property}</span>
                    <span className="flex items-center gap-1"><User className="h-4 w-4" />{request.owner}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{request.createdAt}</span>
                  </div>
                  {request.provider && (
                    <div className="flex items-center gap-2 pt-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-xs bg-primary text-primary-foreground">{request.provider[0]}</AvatarFallback></Avatar>
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
