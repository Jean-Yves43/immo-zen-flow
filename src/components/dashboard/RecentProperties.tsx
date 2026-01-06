import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const properties = [
  {
    id: 1,
    name: "Appartement Haussmannien",
    address: "15 Rue de la Paix, Paris 2ème",
    status: "loué",
    rent: 1450,
    tenant: "Marie Martin",
  },
  {
    id: 2,
    name: "Studio Moderne",
    address: "8 Place Bellecour, Lyon 2ème",
    status: "vacant",
    rent: 680,
    tenant: null,
  },
  {
    id: 3,
    name: "Maison avec Jardin",
    address: "42 Avenue des Platanes, Bordeaux",
    status: "loué",
    rent: 1850,
    tenant: "Pierre Durand",
  },
  {
    id: 4,
    name: "Loft Industriel",
    address: "5 Rue des Usines, Nantes",
    status: "maintenance",
    rent: 1200,
    tenant: "Sophie Lambert",
  },
];

export function RecentProperties() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "loué":
        return <Badge variant="success">Loué</Badge>;
      case "vacant":
        return <Badge variant="outline" className="text-warning border-warning">Vacant</Badge>;
      case "maintenance":
        return <Badge variant="warning">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-border/50 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Mes Biens</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {property.name}
                  </h4>
                  {getStatusBadge(property.status)}
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {property.address}
                </p>
                {property.tenant && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Locataire: {property.tenant}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{property.rent}€</p>
                  <p className="text-xs text-muted-foreground">/mois</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
