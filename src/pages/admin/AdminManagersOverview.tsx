import { useState } from "react";
import {
  Building2,
  Users,
  User,
  Euro,
  TrendingUp,
  Eye,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Manager {
  id: string;
  name: string;
  email: string;
  properties: number;
  owners: number;
  tenants: number;
  monthlyRevenue: number;
  paymentRate: number;
  status: "active" | "inactive";
}

const managers: Manager[] = [
  { id: "1", name: "Pierre Dubois", email: "p.dubois@immo.fr", properties: 45, owners: 18, tenants: 42, monthlyRevenue: 42500, paymentRate: 94, status: "active" },
  { id: "2", name: "Marie Martin", email: "m.martin@immo.fr", properties: 38, owners: 15, tenants: 35, monthlyRevenue: 36200, paymentRate: 98, status: "active" },
  { id: "3", name: "Jean Bernard", email: "j.bernard@immo.fr", properties: 52, owners: 22, tenants: 48, monthlyRevenue: 48900, paymentRate: 91, status: "active" },
  { id: "4", name: "Sophie Petit", email: "s.petit@immo.fr", properties: 41, owners: 16, tenants: 38, monthlyRevenue: 39100, paymentRate: 96, status: "active" },
  { id: "5", name: "Luc Robert", email: "l.robert@immo.fr", properties: 35, owners: 12, tenants: 32, monthlyRevenue: 33200, paymentRate: 88, status: "inactive" },
];

const managerDetails = {
  properties: [
    { reference: "APT-001", type: "Appartement", address: "12 Rue de la Paix, Paris", status: "rented", rent: 1200 },
    { reference: "APT-002", type: "Appartement", address: "45 Avenue Hugo, Paris", status: "rented", rent: 1500 },
    { reference: "VIL-001", type: "Villa", address: "8 Chemin des Pins, Nice", status: "vacant", rent: 2500 },
  ],
  owners: [
    { name: "François Leroy", email: "f.leroy@email.com", properties: 3 },
    { name: "Catherine Moreau", email: "c.moreau@email.com", properties: 5 },
  ],
  tenants: [
    { name: "Julie Fontaine", property: "APT-001", status: "active", lastPayment: "2024-03-01" },
    { name: "Thomas Rousseau", property: "APT-002", status: "active", lastPayment: "2024-03-05" },
  ],
};

export default function AdminManagersOverview() {
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const openManagerDetail = (manager: Manager) => {
    setSelectedManager(manager);
    setIsDetailOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getPaymentRateColor = (rate: number) => {
    if (rate >= 95) return "text-success";
    if (rate >= 85) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aperçu Gestionnaires</h1>
          <p className="text-muted-foreground">
            Performance et activité de chaque gestionnaire
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Rapport comparatif
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Gestionnaires actifs</p>
            <p className="text-2xl font-bold text-success">
              {managers.filter((m) => m.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Propriétés gérées</p>
            <p className="text-2xl font-bold">
              {managers.reduce((sum, m) => sum + m.properties, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Revenus totaux</p>
            <p className="text-2xl font-bold">
              €{managers.reduce((sum, m) => sum + m.monthlyRevenue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Taux paiement moyen</p>
            <p className="text-2xl font-bold text-success">
              {Math.round(managers.reduce((sum, m) => sum + m.paymentRate, 0) / managers.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Manager Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map((manager) => (
          <Card
            key={manager.id}
            className="border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
            onClick={() => openManagerDetail(manager)}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(manager.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{manager.name}</h3>
                    <p className="text-sm text-muted-foreground">{manager.email}</p>
                  </div>
                </div>
                <Badge
                  className={
                    manager.status === "active"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {manager.status === "active" ? "Actif" : "Inactif"}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{manager.properties}</p>
                  <p className="text-xs text-muted-foreground">Propriétés</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="w-4 h-4 mx-auto mb-1 text-secondary" />
                  <p className="text-lg font-bold">{manager.owners}</p>
                  <p className="text-xs text-muted-foreground">Propriétaires</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <User className="w-4 h-4 mx-auto mb-1 text-accent-foreground" />
                  <p className="text-lg font-bold">{manager.tenants}</p>
                  <p className="text-xs text-muted-foreground">Locataires</p>
                </div>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Revenus/mois</span>
                </div>
                <span className="font-bold text-primary">
                  €{manager.monthlyRevenue.toLocaleString()}
                </span>
              </div>

              {/* Payment Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Taux de paiement</span>
                  <span className={`font-medium ${getPaymentRateColor(manager.paymentRate)}`}>
                    {manager.paymentRate}%
                  </span>
                </div>
                <Progress
                  value={manager.paymentRate}
                  className="h-2"
                />
              </div>

              {/* View Details */}
              <Button variant="ghost" className="w-full mt-4 gap-2 text-primary">
                Voir les détails <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manager Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          {selectedManager && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(selectedManager.name)}
                    </AvatarFallback>
                  </Avatar>
                  {selectedManager.name}
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="properties" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="properties">Propriétés</TabsTrigger>
                  <TabsTrigger value="owners">Propriétaires</TabsTrigger>
                  <TabsTrigger value="tenants">Locataires</TabsTrigger>
                  <TabsTrigger value="payments">Paiements</TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Loyer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {managerDetails.properties.map((property) => (
                        <TableRow key={property.reference}>
                          <TableCell className="font-mono text-primary">
                            {property.reference}
                          </TableCell>
                          <TableCell>{property.type}</TableCell>
                          <TableCell>{property.address}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                property.status === "rented"
                                  ? "bg-success/10 text-success"
                                  : "bg-warning/10 text-warning"
                              }
                            >
                              {property.status === "rented" ? "Louée" : "Vacante"}
                            </Badge>
                          </TableCell>
                          <TableCell>€{property.rent.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="owners" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Propriétés</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {managerDetails.owners.map((owner) => (
                        <TableRow key={owner.email}>
                          <TableCell>{owner.name}</TableCell>
                          <TableCell>{owner.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{owner.properties} biens</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="tenants" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Propriété</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Dernier paiement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {managerDetails.tenants.map((tenant) => (
                        <TableRow key={tenant.name}>
                          <TableCell>{tenant.name}</TableCell>
                          <TableCell className="font-mono text-primary">
                            {tenant.property}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-success/10 text-success">Actif</Badge>
                          </TableCell>
                          <TableCell>{tenant.lastPayment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Euro className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Historique des paiements</p>
                    <p className="text-sm">Taux de recouvrement: {selectedManager.paymentRate}%</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
