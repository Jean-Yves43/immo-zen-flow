import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, UserPlus, Search, MoreVertical, MapPin, Calendar, Edit, Trash2, Eye,
  UserCog, UserCheck, User, CheckCircle, XCircle, Clock, Building2, CreditCard,
  Home, Shield, Mail, Phone, TrendingUp,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type UserType = "all" | "manager" | "owner" | "tenant" | "standard";
type UserStatus = "active" | "pending" | "suspended";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: Exclude<UserType, "all">;
  status: UserStatus;
  avatar: string;
  location: string;
  joinDate: string;
  properties?: number;
  revenue?: string;
  rentAmount?: number;
  leaseEnd?: string;
  lastLogin?: string;
}

const initialUsers: UserData[] = [
  { id: 1, name: "Jean Dupont", email: "jean.dupont@email.com", phone: "+33 6 12 34 56 78", type: "manager", status: "active", avatar: "", location: "Paris", joinDate: "2024-01-15", properties: 45, revenue: "€125,000", lastLogin: "2024-01-15" },
  { id: 2, name: "Marie Martin", email: "marie.martin@email.com", phone: "+33 6 23 45 67 89", type: "owner", status: "active", avatar: "", location: "Lyon", joinDate: "2024-02-20", properties: 3, revenue: "€8,500", lastLogin: "2024-01-14" },
  { id: 3, name: "Pierre Durand", email: "pierre.durand@email.com", phone: "+33 6 34 56 78 90", type: "tenant", status: "pending", avatar: "", location: "Marseille", joinDate: "2024-03-10", rentAmount: 850, leaseEnd: "2025-03-10", lastLogin: "2024-01-13" },
  { id: 4, name: "Sophie Bernard", email: "sophie.bernard@email.com", phone: "+33 6 45 67 89 01", type: "standard", status: "active", avatar: "", location: "Bordeaux", joinDate: "2024-03-25", lastLogin: "2024-01-12" },
  { id: 5, name: "Luc Petit", email: "luc.petit@email.com", phone: "+33 6 56 78 90 12", type: "manager", status: "suspended", avatar: "", location: "Toulouse", joinDate: "2023-11-05", properties: 28, revenue: "€78,000", lastLogin: "2023-12-01" },
  { id: 6, name: "Emma Leroy", email: "emma.leroy@email.com", phone: "+33 6 67 89 01 23", type: "owner", status: "active", avatar: "", location: "Nice", joinDate: "2024-01-30", properties: 7, revenue: "€22,000", lastLogin: "2024-01-15" },
  { id: 7, name: "Thomas Moreau", email: "thomas.moreau@email.com", phone: "+33 6 78 90 12 34", type: "tenant", status: "active", avatar: "", location: "Nantes", joinDate: "2024-02-14", rentAmount: 1200, leaseEnd: "2025-08-14", lastLogin: "2024-01-15" },
  { id: 8, name: "Julie Simon", email: "julie.simon@email.com", phone: "+33 6 89 01 23 45", type: "standard", status: "pending", avatar: "", location: "Lille", joinDate: "2024-04-01", lastLogin: "2024-01-10" },
  { id: 9, name: "Antoine Roux", email: "antoine.roux@email.com", phone: "+33 6 90 12 34 56", type: "manager", status: "active", avatar: "", location: "Strasbourg", joinDate: "2024-02-01", properties: 62, revenue: "€185,000", lastLogin: "2024-01-15" },
  { id: 10, name: "Claire Fontaine", email: "claire.fontaine@email.com", phone: "+33 6 01 23 45 67", type: "owner", status: "pending", avatar: "", location: "Montpellier", joinDate: "2024-03-15", properties: 1, revenue: "€2,100", lastLogin: "2024-01-11" },
  { id: 11, name: "Marc Lefebvre", email: "marc.lefebvre@email.com", phone: "+33 6 11 22 33 44", type: "tenant", status: "active", avatar: "", location: "Rennes", joinDate: "2024-01-20", rentAmount: 650, leaseEnd: "2025-01-20", lastLogin: "2024-01-14" },
  { id: 12, name: "Camille Dubois", email: "camille.dubois@email.com", phone: "+33 6 55 66 77 88", type: "standard", status: "active", avatar: "", location: "Grenoble", joinDate: "2024-04-10", lastLogin: "2024-01-09" },
];

const routeToType: Record<string, UserType> = {
  "/admin2/users": "all",
  "/admin2/users/managers": "manager",
  "/admin2/users/owners": "owner",
  "/admin2/users/tenants": "tenant",
  "/admin2/users/standard": "standard",
};

const userTypeConfig = {
  manager: {
    label: "Gestionnaire", icon: UserCog,
    color: "from-purple-500 to-violet-500",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    headerGradient: "from-purple-600/30 via-violet-600/20 to-purple-900/30",
    headerBorder: "border-purple-500/40",
    accentText: "text-purple-400",
    description: "Gèrent les propriétés et les locataires pour le compte des propriétaires",
    statsIcon1: Building2, statsIcon2: Users, statsIcon3: TrendingUp,
    stat1Label: "Propriétés gérées", stat2Label: "Locataires suivis", stat3Label: "Revenus générés",
  },
  owner: {
    label: "Propriétaire", icon: UserCheck,
    color: "from-emerald-500 to-cyan-500",
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    headerGradient: "from-emerald-600/30 via-cyan-600/20 to-emerald-900/30",
    headerBorder: "border-emerald-500/40",
    accentText: "text-emerald-400",
    description: "Possèdent des biens immobiliers et perçoivent des revenus locatifs",
    statsIcon1: Home, statsIcon2: CreditCard, statsIcon3: TrendingUp,
    stat1Label: "Biens possédés", stat2Label: "Revenus mensuels", stat3Label: "Taux d'occupation",
  },
  tenant: {
    label: "Locataire", icon: User,
    color: "from-blue-500 to-indigo-500",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    headerGradient: "from-blue-600/30 via-indigo-600/20 to-blue-900/30",
    headerBorder: "border-blue-500/40",
    accentText: "text-blue-400",
    description: "Occupent les logements et effectuent les paiements de loyer",
    statsIcon1: Home, statsIcon2: CreditCard, statsIcon3: Calendar,
    stat1Label: "Logements occupés", stat2Label: "Loyers moyens", stat3Label: "Baux actifs",
  },
  standard: {
    label: "Standard", icon: User,
    color: "from-orange-500 to-amber-500",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    headerGradient: "from-orange-600/30 via-amber-600/20 to-orange-900/30",
    headerBorder: "border-orange-500/40",
    accentText: "text-orange-400",
    description: "Utilisateurs de base avec accès limité à la plateforme",
    statsIcon1: Users, statsIcon2: Mail, statsIcon3: Shield,
    stat1Label: "Comptes actifs", stat2Label: "Dernière activité", stat3Label: "Vérifiés",
  },
  all: {
    label: "Tous", icon: Users,
    color: "from-slate-500 to-slate-600",
    badge: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    headerGradient: "from-slate-600/30 via-slate-600/20 to-slate-900/30",
    headerBorder: "border-slate-500/40",
    accentText: "text-slate-400",
    description: "Vue d'ensemble de tous les utilisateurs",
    statsIcon1: Users, statsIcon2: Users, statsIcon3: Users,
    stat1Label: "", stat2Label: "", stat3Label: "",
  },
};

const statusConfig = {
  active: { label: "Actif", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  pending: { label: "En attente", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
  suspended: { label: "Suspendu", icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
};

const emptyForm = { firstName: "", lastName: "", email: "", phone: "", type: "" as string, location: "", password: "" };

export default function Admin2Users() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<UserType>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [form, setForm] = useState(emptyForm);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [viewUser, setViewUser] = useState<UserData | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserData | null>(null);

  const isCreateRoute = location.pathname === "/admin2/users/create";

  useEffect(() => {
    if (isCreateRoute) {
      setIsCreateOpen(true);
      return;
    }
    const type = routeToType[location.pathname] || "all";
    setSelectedType(type);
  }, [location.pathname, isCreateRoute]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || user.type === selectedType;
    return matchesSearch && matchesType;
  });

  const currentConfig = userTypeConfig[selectedType];
  const isSingleType = selectedType !== "all";

  const handleCreate = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.type) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const newUser: UserData = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: `${form.firstName} ${form.lastName}`,
      email: form.email, phone: form.phone,
      type: form.type as Exclude<UserType, "all">,
      status: "pending", avatar: "", location: form.location,
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0],
    };
    setUsers(prev => [...prev, newUser]);
    setForm(emptyForm);
    setIsCreateOpen(false);
    if (isCreateRoute) navigate("/admin2/users");
    toast.success(`Utilisateur ${newUser.name} créé avec succès`);
  };

  const handleEdit = (user: UserData) => {
    setEditUser(user);
    setForm({ firstName: user.name.split(" ")[0], lastName: user.name.split(" ").slice(1).join(" "), email: user.email, phone: user.phone, type: user.type, location: user.location, password: "" });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editUser) return;
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone, type: form.type as Exclude<UserType, "all">, location: form.location } : u));
    setIsEditOpen(false); setEditUser(null); setForm(emptyForm);
    toast.success("Utilisateur modifié avec succès");
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
    setIsDeleteOpen(false); toast.success(`Utilisateur ${deleteUser.name} supprimé`); setDeleteUser(null);
  };

  const handleToggleStatus = (user: UserData) => {
    const newStatus: UserStatus = user.status === "active" ? "suspended" : "active";
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    toast.success(`Statut de ${user.name} changé en ${statusConfig[newStatus].label}`);
  };

  const typeStats = {
    manager: { count: users.filter(u => u.type === "manager").length, totalProps: users.filter(u => u.type === "manager").reduce((s, u) => s + (u.properties || 0), 0), totalRevenue: "€388,000" },
    owner: { count: users.filter(u => u.type === "owner").length, totalProps: users.filter(u => u.type === "owner").reduce((s, u) => s + (u.properties || 0), 0), totalRevenue: "€32,600" },
    tenant: { count: users.filter(u => u.type === "tenant").length, avgRent: Math.round(users.filter(u => u.type === "tenant" && u.rentAmount).reduce((s, u) => s + (u.rentAmount || 0), 0) / Math.max(users.filter(u => u.type === "tenant" && u.rentAmount).length, 1)), activeLeases: users.filter(u => u.type === "tenant" && u.status === "active").length },
    standard: { count: users.filter(u => u.type === "standard").length, active: users.filter(u => u.type === "standard" && u.status === "active").length, verified: users.filter(u => u.type === "standard" && u.status === "active").length },
  };

  const renderUserForm = (onSubmit: () => void, submitLabel: string) => (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Prénom *</label>
          <Input className="bg-slate-800 border-slate-700" placeholder="Jean" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Nom *</label>
          <Input className="bg-slate-800 border-slate-700" placeholder="Dupont" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Email *</label>
          <Input className="bg-slate-800 border-slate-700" placeholder="jean@email.com" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Téléphone</label>
          <Input className="bg-slate-800 border-slate-700" placeholder="+33 6 12 34 56 78" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Type d'utilisateur *</label>
          <Select value={form.type || (isSingleType ? selectedType : "")} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
            <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
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
          <Input className="bg-slate-800 border-slate-700" placeholder="Paris" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); setForm(emptyForm); if (isCreateRoute) navigate("/admin2/users"); }} className="border-slate-700 text-slate-300">Annuler</Button>
        <Button className={`bg-gradient-to-r ${isSingleType ? currentConfig.color : "from-emerald-500 to-cyan-500"}`} onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </>
  );

  const renderTypeSpecificInfo = (user: UserData) => {
    if (user.type === "manager") {
      return (
        <div className="mt-4 pt-4 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">Propriétés</span><p className="text-purple-400 font-semibold">{user.properties}</p></div>
          <div><span className="text-slate-400">Revenus</span><p className="text-purple-400 font-semibold">{user.revenue}</p></div>
        </div>
      );
    }
    if (user.type === "owner") {
      return (
        <div className="mt-4 pt-4 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">Biens</span><p className="text-emerald-400 font-semibold">{user.properties}</p></div>
          <div><span className="text-slate-400">Revenus</span><p className="text-emerald-400 font-semibold">{user.revenue}</p></div>
        </div>
      );
    }
    if (user.type === "tenant") {
      return (
        <div className="mt-4 pt-4 border-t border-blue-500/20 grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">Loyer</span><p className="text-blue-400 font-semibold">€{user.rentAmount || "N/A"}</p></div>
          <div><span className="text-slate-400">Fin bail</span><p className="text-blue-400 font-semibold">{user.leaseEnd ? new Date(user.leaseEnd).toLocaleDateString("fr-FR") : "N/A"}</p></div>
        </div>
      );
    }
    if (user.type === "standard") {
      return (
        <div className="mt-4 pt-4 border-t border-orange-500/20 text-sm">
          <div><span className="text-slate-400">Dernière connexion</span><p className="text-orange-400 font-semibold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fr-FR") : "N/A"}</p></div>
        </div>
      );
    }
    return null;
  };

  const renderRoleSpecificStats = () => {
    if (selectedType === "manager") {
      const s = typeStats.manager;
      return (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20"><Building2 className="w-6 h-6 text-purple-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.totalProps}</p><p className="text-sm text-purple-300">Propriétés gérées</p></div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20"><Users className="w-6 h-6 text-purple-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.count}</p><p className="text-sm text-purple-300">Gestionnaires</p></div>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20"><TrendingUp className="w-6 h-6 text-purple-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.totalRevenue}</p><p className="text-sm text-purple-300">Revenus générés</p></div>
            </CardContent>
          </Card>
        </div>
      );
    }
    if (selectedType === "owner") {
      const s = typeStats.owner;
      return (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20"><Home className="w-6 h-6 text-emerald-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.totalProps}</p><p className="text-sm text-emerald-300">Biens possédés</p></div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20"><UserCheck className="w-6 h-6 text-emerald-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.count}</p><p className="text-sm text-emerald-300">Propriétaires</p></div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20"><CreditCard className="w-6 h-6 text-emerald-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.totalRevenue}</p><p className="text-sm text-emerald-300">Revenus mensuels</p></div>
            </CardContent>
          </Card>
        </div>
      );
    }
    if (selectedType === "tenant") {
      const s = typeStats.tenant;
      return (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20"><User className="w-6 h-6 text-blue-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.count}</p><p className="text-sm text-blue-300">Locataires</p></div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20"><CreditCard className="w-6 h-6 text-blue-400" /></div>
              <div><p className="text-2xl font-bold text-white">€{s.avgRent}</p><p className="text-sm text-blue-300">Loyer moyen</p></div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20"><Calendar className="w-6 h-6 text-blue-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.activeLeases}</p><p className="text-sm text-blue-300">Baux actifs</p></div>
            </CardContent>
          </Card>
        </div>
      );
    }
    if (selectedType === "standard") {
      const s = typeStats.standard;
      return (
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20"><Users className="w-6 h-6 text-orange-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.count}</p><p className="text-sm text-orange-300">Utilisateurs standard</p></div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20"><CheckCircle className="w-6 h-6 text-orange-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.active}</p><p className="text-sm text-orange-300">Comptes actifs</p></div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/20"><Shield className="w-6 h-6 text-orange-400" /></div>
              <div><p className="text-2xl font-bold text-white">{s.verified}</p><p className="text-sm text-orange-300">Vérifiés</p></div>
            </CardContent>
          </Card>
        </div>
      );
    }
    // All types stats
    return (
      <div className="grid grid-cols-4 gap-4">
        {(["manager", "owner", "tenant", "standard"] as const).map((type) => {
          const config = userTypeConfig[type];
          const count = users.filter(u => u.type === type).length;
          return (
            <Card key={type} className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all hover:border-slate-600`} onClick={() => navigate(`/admin2/users/${type === "manager" ? "managers" : type === "owner" ? "owners" : type === "tenant" ? "tenants" : "standard"}`)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}><config.icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-2xl font-bold text-white">{count}</p><p className="text-sm text-slate-400">{config.label}s</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Type-specific Header Banner */}
      {isSingleType && (
        <div className={`rounded-2xl bg-gradient-to-r ${currentConfig.headerGradient} border ${currentConfig.headerBorder} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentConfig.color}`}>
                <currentConfig.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{currentConfig.label}s</h1>
                <p className={`${currentConfig.accentText} mt-1`}>{currentConfig.description}</p>
                <p className="text-slate-400 text-sm mt-1">{filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <Button className={`bg-gradient-to-r ${currentConfig.color} hover:opacity-90 text-white gap-2`} onClick={() => { setForm({ ...emptyForm, type: selectedType }); setIsCreateOpen(true); }}>
              <UserPlus className="w-4 h-4" />Ajouter un {currentConfig.label.toLowerCase()}
            </Button>
          </div>
        </div>
      )}

      {/* Generic Header for "all" */}
      {!isSingleType && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
            <p className="text-slate-400 mt-1">Gérez tous les utilisateurs de la plateforme ({users.length} total)</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2" onClick={() => navigate("/admin2/users/create")}>
            <UserPlus className="w-4 h-4" />Créer un utilisateur
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(o) => { setIsCreateOpen(o); if (!o) { setForm(emptyForm); if (isCreateRoute) navigate("/admin2/users"); } }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader><DialogTitle className="text-xl flex items-center gap-2">
            {isSingleType && <currentConfig.icon className={`w-5 h-5 ${currentConfig.accentText}`} />}
            {isSingleType ? `Créer un ${currentConfig.label.toLowerCase()}` : "Créer un nouvel utilisateur"}
          </DialogTitle></DialogHeader>
          {renderUserForm(handleCreate, isSingleType ? `Créer le ${currentConfig.label.toLowerCase()}` : "Créer l'utilisateur")}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(o) => { setIsEditOpen(o); if (!o) { setEditUser(null); setForm(emptyForm); } }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader><DialogTitle className="text-xl">Modifier l'utilisateur</DialogTitle></DialogHeader>
          {renderUserForm(handleSaveEdit, "Enregistrer")}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-xl">Profil utilisateur</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="mt-4 space-y-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${userTypeConfig[viewUser.type].headerGradient} border ${userTypeConfig[viewUser.type].headerBorder}`}>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-slate-700">
                    <AvatarFallback className={`bg-gradient-to-br ${userTypeConfig[viewUser.type].color} text-white font-bold text-lg`}>
                      {viewUser.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold text-white">{viewUser.name}</h3>
                    <Badge className={userTypeConfig[viewUser.type].badge}>{userTypeConfig[viewUser.type].label}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-slate-800/50">
                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Mail className="w-4 h-4" />Email</span><span className="text-white">{viewUser.email}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Phone className="w-4 h-4" />Téléphone</span><span className="text-white">{viewUser.phone}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><MapPin className="w-4 h-4" />Localisation</span><span className="text-white">{viewUser.location}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4" />Inscription</span><span className="text-white">{new Date(viewUser.joinDate).toLocaleDateString("fr-FR")}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Statut</span><Badge className={`${statusConfig[viewUser.status].bg} ${statusConfig[viewUser.status].color} border-0`}>{statusConfig[viewUser.status].label}</Badge></div>
                {viewUser.properties != null && <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Building2 className="w-4 h-4" />Propriétés</span><span className="text-white">{viewUser.properties}</span></div>}
                {viewUser.revenue && <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><CreditCard className="w-4 h-4" />Revenus</span><span className={userTypeConfig[viewUser.type].accentText}>{viewUser.revenue}</span></div>}
                {viewUser.rentAmount && <div className="flex justify-between items-center"><span className="text-slate-400">Loyer</span><span className="text-blue-400">€{viewUser.rentAmount}</span></div>}
                {viewUser.leaseEnd && <div className="flex justify-between items-center"><span className="text-slate-400">Fin de bail</span><span className="text-blue-400">{new Date(viewUser.leaseEnd).toLocaleDateString("fr-FR")}</span></div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-xl">Confirmer la suppression</DialogTitle></DialogHeader>
          <p className="text-slate-400 mt-2">Êtes-vous sûr de vouloir supprimer <span className="text-white font-medium">{deleteUser?.name}</span> ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="border-slate-700" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      {renderRoleSpecificStats()}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Rechercher un utilisateur..." className="pl-10 bg-slate-800/50 border-slate-700/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        {!isSingleType && (
          <Select value={selectedType} onValueChange={(v) => {
            const type = v as UserType;
            if (type === "all") navigate("/admin2/users");
            else navigate(`/admin2/users/${type === "manager" ? "managers" : type === "owner" ? "owners" : type === "tenant" ? "tenants" : "standard"}`);
          }}>
            <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50"><SelectValue placeholder="Type d'utilisateur" /></SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="manager">Gestionnaires</SelectItem>
              <SelectItem value="owner">Propriétaires</SelectItem>
              <SelectItem value="tenant">Locataires</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")} className={viewMode === "grid" ? `bg-gradient-to-r ${isSingleType ? currentConfig.color : "from-emerald-500 to-cyan-500"}` : "border-slate-700"}>Grille</Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")} className={viewMode === "list" ? `bg-gradient-to-r ${isSingleType ? currentConfig.color : "from-emerald-500 to-cyan-500"}` : "border-slate-700"}>Liste</Button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => {
            const typeConfig = userTypeConfig[user.type];
            const statusConf = statusConfig[user.status];
            return (
              <Card key={user.id} className={`bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all group ${isSingleType ? `hover:${currentConfig.headerBorder}` : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-14 w-14 ring-2 ring-slate-700">
                      <AvatarFallback className={`bg-gradient-to-br ${typeConfig.color} text-white font-bold`}>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-slate-300" onClick={() => { setViewUser(user); setIsViewOpen(true); }}><Eye className="w-4 h-4 mr-2" />Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300" onClick={() => handleEdit(user)}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-slate-300" onClick={() => handleToggleStatus(user)}>
                          {user.status === "active" ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                          {user.status === "active" ? "Suspendre" : "Activer"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400" onClick={() => { setDeleteUser(user); setIsDeleteOpen(true); }}><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{user.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{user.email}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={typeConfig.badge}>{typeConfig.label}</Badge>
                    <Badge className={`${statusConf.bg} ${statusConf.color} border-0 cursor-pointer`} onClick={() => handleToggleStatus(user)}>
                      <statusConf.icon className="w-3 h-3 mr-1" />{statusConf.label}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-4 h-4" />{user.location}</div>
                    <div className="flex items-center gap-2 text-slate-400"><Calendar className="w-4 h-4" />Inscrit le {new Date(user.joinDate).toLocaleDateString("fr-FR")}</div>
                  </div>
                  {renderTypeSpecificInfo(user)}
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
                    {!isSingleType && <th className="text-left p-4 text-slate-400 font-medium">Type</th>}
                    <th className="text-left p-4 text-slate-400 font-medium">Statut</th>
                    <th className="text-left p-4 text-slate-400 font-medium">Localisation</th>
                    {selectedType === "tenant" && <th className="text-left p-4 text-slate-400 font-medium">Loyer</th>}
                    {(selectedType === "manager" || selectedType === "owner") && <th className="text-left p-4 text-slate-400 font-medium">Propriétés</th>}
                    {(selectedType === "manager" || selectedType === "owner") && <th className="text-left p-4 text-slate-400 font-medium">Revenus</th>}
                    <th className="text-left p-4 text-slate-400 font-medium">Inscription</th>
                    <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const tc = userTypeConfig[user.type];
                    const sc = statusConfig[user.status];
                    return (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10"><AvatarFallback className={`bg-gradient-to-br ${tc.color} text-white text-sm`}>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                            <div><p className="font-medium text-white">{user.name}</p><p className="text-sm text-slate-400">{user.email}</p></div>
                          </div>
                        </td>
                        {!isSingleType && <td className="p-4"><Badge className={tc.badge}>{tc.label}</Badge></td>}
                        <td className="p-4">
                          <Badge className={`${sc.bg} ${sc.color} border-0 cursor-pointer`} onClick={() => handleToggleStatus(user)}>
                            <sc.icon className="w-3 h-3 mr-1" />{sc.label}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-300">{user.location}</td>
                        {selectedType === "tenant" && <td className="p-4 text-blue-400 font-medium">€{user.rentAmount || "N/A"}</td>}
                        {(selectedType === "manager" || selectedType === "owner") && <td className="p-4 text-white">{user.properties}</td>}
                        {(selectedType === "manager" || selectedType === "owner") && <td className={`p-4 font-medium ${tc.accentText}`}>{user.revenue}</td>}
                        <td className="p-4 text-slate-400">{new Date(user.joinDate).toLocaleDateString("fr-FR")}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => { setViewUser(user); setIsViewOpen(true); }}><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => handleEdit(user)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => { setDeleteUser(user); setIsDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          {isSingleType ? <currentConfig.icon className="w-12 h-12 text-slate-600 mx-auto mb-4" /> : <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />}
          <p className="text-slate-400">Aucun {isSingleType ? currentConfig.label.toLowerCase() : "utilisateur"} trouvé</p>
        </div>
      )}
    </div>
  );
}
