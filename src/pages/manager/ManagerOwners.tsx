import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Plus, Home, Euro, MoreHorizontal, Eye, UserMinus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const owners = [
  { id: 1, name: "Pierre Martin", email: "pierre.martin@email.com", properties: 12, tenants: 9, revenue: 18450, paymentRate: 95 },
  { id: 2, name: "Claire Durand", email: "claire.durand@email.com", properties: 8, tenants: 7, revenue: 12300, paymentRate: 100 },
  { id: 3, name: "Paul Bernard", email: "paul.bernard@email.com", properties: 5, tenants: 4, revenue: 9800, paymentRate: 88 },
  { id: 4, name: "Sophie Petit", email: "sophie.petit@email.com", properties: 15, tenants: 12, revenue: 24500, paymentRate: 92 },
  { id: 5, name: "Jean Robert", email: "jean.robert@email.com", properties: 5, tenants: 3, revenue: 5200, paymentRate: 100 },
];

export default function ManagerOwners() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleManageOwner = (owner: typeof owners[0]) => {
    navigate(`/owner?managedBy=manager&managerName=${encodeURIComponent(owner.name)}`);
  };

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propriétaires</h1>
          <p className="text-muted-foreground mt-1">Gérez vos {owners.length} propriétaires</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="mr-2 h-4 w-4" />Ajouter un propriétaire
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un propriétaire</DialogTitle>
              <DialogDescription>Invitez un nouveau propriétaire à rejoindre votre portefeuille.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>Nom complet</Label><Input placeholder="Pierre Martin" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="pierre@email.com" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">Envoyer l'invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total propriétaires</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{owners.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total biens</CardTitle>
            <Home className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-secondary">{owners.reduce((sum, o) => sum + o.properties, 0)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenus totaux</CardTitle>
            <Euro className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{(owners.reduce((sum, o) => sum + o.revenue, 0) / 1000).toFixed(1)}K €</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un propriétaire..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOwners.map((owner) => (
          <Card key={owner.id} className="hover-lift">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">{owner.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{owner.name}</h3>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleManageOwner(owner)}><Eye className="mr-2 h-4 w-4" />Gérer ce propriétaire</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"><UserMinus className="mr-2 h-4 w-4" />Retirer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{owner.properties}</p>
                  <p className="text-xs text-muted-foreground">Biens</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{owner.tenants}</p>
                  <p className="text-xs text-muted-foreground">Locataires</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Euro className="h-4 w-4 text-secondary" />
                  <span className="font-semibold text-secondary">{owner.revenue.toLocaleString()} €</span>
                  <span className="text-xs text-muted-foreground">/mois</span>
                </div>
                <Badge className={owner.paymentRate >= 95 ? "bg-secondary text-secondary-foreground" : owner.paymentRate >= 85 ? "bg-orange-500" : "bg-destructive"}>
                  {owner.paymentRate}% payés
                </Badge>
              </div>
              <Button onClick={() => handleManageOwner(owner)} className="w-full mt-4 bg-primary hover:bg-primary/90">
                <TrendingUp className="mr-2 h-4 w-4" />Gérer ce propriétaire
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
