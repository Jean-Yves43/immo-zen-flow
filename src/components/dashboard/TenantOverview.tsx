import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const tenants = [
  {
    id: 1,
    name: "Marie Martin",
    property: "Apt 3B - Rue de la Paix",
    status: "payé",
    dueDate: "01/07/2024",
    initials: "MM",
  },
  {
    id: 2,
    name: "Pierre Durand",
    property: "Maison - Avenue des Platanes",
    status: "payé",
    dueDate: "05/07/2024",
    initials: "PD",
  },
  {
    id: 3,
    name: "Sophie Lambert",
    property: "Loft - Rue des Usines",
    status: "en retard",
    dueDate: "01/07/2024",
    initials: "SL",
  },
  {
    id: 4,
    name: "Lucas Bernard",
    property: "Studio - Place Bellecour",
    status: "en attente",
    dueDate: "10/07/2024",
    initials: "LB",
  },
];

export function TenantOverview() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payé":
        return <Badge variant="success">Payé</Badge>;
      case "en retard":
        return <Badge variant="destructive">En retard</Badge>;
      case "en attente":
        return <Badge variant="outline">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-border/50 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold">Locataires</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          Voir tout
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                    {tenant.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{tenant.name}</h4>
                  <p className="text-xs text-muted-foreground">{tenant.property}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  {getStatusBadge(tenant.status)}
                  <p className="text-xs text-muted-foreground mt-1">
                    Échéance: {tenant.dueDate}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
