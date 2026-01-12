// src/features/admin-dashboard/pages/AdminUsers.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Badge } from "../../../components/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dialog";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";


const userData = {
  managers: [
    { id: "1", name: "Pierre Dubois", email: "p.dubois@immo.fr", phone: "+33 6 12 34 56 78", status: "active", createdAt: "2024-01-15", properties: 45 },
    { id: "2", name: "Marie Martin", email: "m.martin@immo.fr", phone: "+33 6 23 45 67 89", status: "active", createdAt: "2024-02-20", properties: 38 },
    { id: "3", name: "Jean Bernard", email: "j.bernard@immo.fr", phone: "+33 6 34 56 78 90", status: "pending", createdAt: "2024-03-10", properties: 52 },
    { id: "4", name: "Sophie Petit", email: "s.petit@immo.fr", phone: "+33 6 45 67 89 01", status: "active", createdAt: "2024-01-08", properties: 41 },
    { id: "5", name: "Luc Robert", email: "l.robert@immo.fr", phone: "+33 6 56 78 90 12", status: "inactive", createdAt: "2023-11-25", properties: 35 },
  ],
  owners: [
    { id: "1", name: "François Leroy", email: "f.leroy@email.com", phone: "+33 6 11 22 33 44", status: "active", createdAt: "2024-01-20", manager: "Pierre Dubois", properties: 3 },
    { id: "2", name: "Catherine Moreau", email: "c.moreau@email.com", phone: "+33 6 22 33 44 55", status: "active", createdAt: "2024-02-15", manager: "Marie Martin", properties: 5 },
    { id: "3", name: "André Simon", email: "a.simon@email.com", phone: "+33 6 33 44 55 66", status: "pending", createdAt: "2024-03-05", manager: "Jean Bernard", properties: 2 },
    { id: "4", name: "Isabelle Laurent", email: "i.laurent@email.com", phone: "+33 6 44 55 66 77", status: "active", createdAt: "2024-01-30", manager: "Sophie Petit", properties: 4 },
    { id: "5", name: "Michel Girard", email: "m.girard@email.com", phone: "+33 6 55 66 77 88", status: "inactive", createdAt: "2023-12-10", manager: "Luc Robert", properties: 1 },
  ],
  tenants: [
    { id: "1", name: "Julie Fontaine", email: "j.fontaine@email.com", phone: "+33 6 10 20 30 40", status: "active", createdAt: "2024-02-01", manager: "Pierre Dubois" },
    { id: "2", name: "Thomas Rousseau", email: "t.rousseau@email.com", phone: "+33 6 20 30 40 50", status: "active", createdAt: "2024-01-15", manager: "Marie Martin" },
    { id: "3", name: "Emma Blanc", email: "e.blanc@email.com", phone: "+33 6 30 40 50 60", status: "pending", createdAt: "2024-03-12", manager: "Jean Bernard" },
    { id: "4", name: "Lucas Garnier", email: "l.garnier@email.com", phone: "+33 6 40 50 60 70", status: "active", createdAt: "2024-02-20", manager: "Sophie Petit" },
    { id: "5", name: "Chloé Chevalier", email: "c.chevalier@email.com", phone: "+33 6 50 60 70 80", status: "inactive", createdAt: "2023-10-05", manager: "Luc Robert" },
  ],
};

const userTypeLabels = {
  managers: { singular: "Gestionnaire", plural: "Gestionnaires" },
  owners: { singular: "Propriétaire", plural: "Propriétaires" },
  tenants: { singular: "Locataire", plural: "Locataires" },
};

export default function AdminUsers() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const userType = pathSegments[pathSegments.length - 1];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const users = userData[userType] || [];
  const labels = userTypeLabels[userType] || userTypeLabels.managers;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-success/10 text-success border-success/20",
      inactive: "bg-muted text-muted-foreground border-muted",
      pending: "bg-warning/10 text-warning border-warning/20"
    };
    const texts = {
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente"
    };
    return <Badge className={badges[status]}>{texts[status]}</Badge>;
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{labels.plural}</h1>
          <p className="text-muted-foreground">
            Gérez les {labels.plural.toLowerCase()} de la plateforme
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Créer un {labels.singular.toLowerCase()}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un {labels.singular.toLowerCase()}</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouveau {labels.singular.toLowerCase()}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Jean Dupont" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jean.dupont@email.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
              </div>
              {userType !== "managers" && (
                <div className="grid gap-2">
                  <Label htmlFor="manager">Gestionnaire assigné</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un gestionnaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {userData.managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-primary" onClick={() => setIsCreateDialogOpen(false)}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Actifs</p>
            <p className="text-2xl font-bold text-success">
              {users.filter((u) => u.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">En attente</p>
            <p className="text-2xl font-bold text-warning">
              {users.filter((u) => u.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Inactifs</p>
            <p className="text-2xl font-bold text-muted-foreground">
              {users.filter((u) => u.status === "inactive").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="border-border/50 shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={`Rechercher un ${labels.singular.toLowerCase()}...`}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                {userType !== "managers" && <TableHead>Gestionnaire</TableHead>}
                {userType === "managers" && <TableHead>Propriétés</TableHead>}
                <TableHead>Statut</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  {userType !== "managers" && (
                    <TableCell className="text-muted-foreground">{user.manager}</TableCell>
                  )}
                  {userType === "managers" && (
                    <TableCell>
                      <Badge variant="outline">{user.properties} biens</Badge>
                    </TableCell>
                  )}
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem className="gap-2 text-warning">
                            <UserX className="w-4 h-4" />
                            Désactiver
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-success">
                            <UserCheck className="w-4 h-4" />
                            Activer
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="w-4 h-4" />
                          Supprimer
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