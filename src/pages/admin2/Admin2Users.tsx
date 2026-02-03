import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Eye,
  UserCog,
  UserCheck,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserType = "all" | "manager" | "owner" | "tenant" | "standard";
type UserStatus = "active" | "pending" | "suspended";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  status: UserStatus;
  avatar: string;
  location: string;
  joinDate: string;
  properties?: number;
  revenue?: string;
}

const mockUsers: UserData[] = [
  { id: 1, name: "Jean Dupont", email: "jean.dupont@email.com", phone: "+33 6 12 34 56 78", type: "manager", status: "active", avatar: "", location: "Paris", joinDate: "2024-01-15", properties: 45, revenue: "€125,000" },
  { id: 2, name: "Marie Martin", email: "marie.martin@email.com", phone: "+33 6 23 45 67 89", type: "owner", status: "active", avatar: "", location: "Lyon", joinDate: "2024-02-20", properties: 3, revenue: "€8,500" },
  { id: 3, name: "Pierre Durand", email: "pierre.durand@email.com", phone: "+33 6 34 56 78 90", type: "tenant", status: "pending", avatar: "", location: "Marseille", joinDate: "2024-03-10" },
  { id: 4, name: "Sophie Bernard", email: "sophie.bernard@email.com", phone: "+33 6 45 67 89 01", type: "standard", status: "active", avatar: "", location: "Bordeaux", joinDate: "2024-03-25" },
  { id: 5, name: "Luc Petit", email: "luc.petit@email.com", phone: "+33 6 56 78 90 12", type: "manager", status: "suspended", avatar: "", location: "Toulouse", joinDate: "2023-11-05", properties: 28, revenue: "€78,000" },
  { id: 6, name: "Emma Leroy", email: "emma.leroy@email.com", phone: "+33 6 67 89 01 23", type: "owner", status: "active", avatar: "", location: "Nice", joinDate: "2024-01-30", properties: 7, revenue: "€22,000" },
  { id: 7, name: "Thomas Moreau", email: "thomas.moreau@email.com", phone: "+33 6 78 90 12 34", type: "tenant", status: "active", avatar: "", location: "Nantes", joinDate: "2024-02-14" },
  { id: 8, name: "Julie Simon", email: "julie.simon@email.com", phone: "+33 6 89 01 23 45", type: "standard", status: "pending", avatar: "", location: "Lille", joinDate: "2024-04-01" },
];

const userTypeConfig = {
  manager: { label: "Gestionnaire", icon: UserCog, color: "from-purple-500 to-violet-500", badge: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  owner: { label: "Propriétaire", icon: UserCheck, color: "from-emerald-500 to-cyan-500", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  tenant: { label: "Locataire", icon: User, color: "from-blue-500 to-indigo-500", badge: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  standard: { label: "Standard", icon: User, color: "from-orange-500 to-amber-500", badge: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  all: { label: "Tous", icon: Users, color: "from-slate-500 to-slate-600", badge: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
};

const statusConfig = {
  active: { label: "Actif", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  pending: { label: "En attente", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
  suspended: { label: "Suspendu", icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
};

export default function Admin2Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<UserType>("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || user.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = [
    { type: "manager" as UserType, count: mockUsers.filter(u => u.type === "manager").length },
    { type: "owner" as UserType, count: mockUsers.filter(u => u.type === "owner").length },
    { type: "tenant" as UserType, count: mockUsers.filter(u => u.type === "tenant").length },
    { type: "standard" as UserType, count: mockUsers.filter(u => u.type === "standard").length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
          <p className="text-slate-400 mt-1">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <UserPlus className="w-4 h-4" />
              Créer un utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Créer un nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Prénom</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="Jean" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Nom</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="Dupont" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Email</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="jean@email.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Téléphone</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Type d'utilisateur</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="manager">Gestionnaire</SelectItem>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                    <SelectItem value="tenant">Locataire</SelectItem>
                    <SelectItem value="standard">Utilisateur standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Localisation</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="Paris" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm text-slate-400">Mot de passe temporaire</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="••••••••" type="password" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-slate-700 text-slate-300">
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                Créer l'utilisateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const config = userTypeConfig[stat.type];
          return (
            <Card
              key={stat.type}
              className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all duration-300 ${selectedType === stat.type ? "ring-2 ring-emerald-500" : "hover:border-slate-600"}`}
              onClick={() => setSelectedType(stat.type)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}>
                  <config.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.count}</p>
                  <p className="text-sm text-slate-400">{config.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-10 bg-slate-800/50 border-slate-700/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={(v) => setSelectedType(v as UserType)}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50">
            <SelectValue placeholder="Type d'utilisateur" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="manager">Gestionnaires</SelectItem>
            <SelectItem value="owner">Propriétaires</SelectItem>
            <SelectItem value="tenant">Locataires</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-emerald-500" : "border-slate-700"}
          >
            Grille
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-emerald-500" : "border-slate-700"}
          >
            Liste
          </Button>
        </div>
      </div>

      {/* Users Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => {
            const typeConfig = userTypeConfig[user.type];
            const statusConf = statusConfig[user.status];
            return (
              <Card key={user.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-14 w-14 ring-2 ring-slate-700">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className={`bg-gradient-to-br ${typeConfig.color} text-white font-bold`}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-slate-300">
                          <Eye className="w-4 h-4 mr-2" /> Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300">
                          <Edit className="w-4 h-4 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{user.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{user.email}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={typeConfig.badge}>{typeConfig.label}</Badge>
                    <Badge className={`${statusConf.bg} ${statusConf.color} border-0`}>
                      <statusConf.icon className="w-3 h-3 mr-1" />
                      {statusConf.label}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      Inscrit le {new Date(user.joinDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  {(user.type === "manager" || user.type === "owner") && user.properties && (
                    <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-sm">
                      <span className="text-slate-400">{user.properties} propriétés</span>
                      <span className="text-emerald-400 font-medium">{user.revenue}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-4 text-slate-400 font-medium">Utilisateur</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Type</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Statut</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Localisation</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Inscription</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const typeConfig = userTypeConfig[user.type];
                    const statusConf = statusConfig[user.status];
                    return (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={`bg-gradient-to-br ${typeConfig.color} text-white text-sm`}>
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-white">{user.name}</p>
                              <p className="text-sm text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={typeConfig.badge}>{typeConfig.label}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${statusConf.bg} ${statusConf.color} border-0`}>
                            <statusConf.icon className="w-3 h-3 mr-1" />
                            {statusConf.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-300">{user.location}</td>
                        <td className="p-4 text-slate-400">{new Date(user.joinDate).toLocaleDateString("fr-FR")}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
