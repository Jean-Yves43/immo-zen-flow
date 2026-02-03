import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Building2,
  Plus,
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Euro,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Home,
  Building,
  Castle,
  Warehouse,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Property {
  id: number;
  title: string;
  address: string;
  type: "apartment" | "house" | "villa" | "commercial";
  status: "available" | "rented" | "sale" | "maintenance";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  owner: string;
  image: string;
}

const mockProperties: Property[] = [
  { id: 1, title: "Appartement Moderne Centre-Ville", address: "15 Rue de la Paix, Paris", type: "apartment", status: "rented", price: 1500, bedrooms: 2, bathrooms: 1, area: 65, owner: "Jean Dupont", image: "/placeholder.svg" },
  { id: 2, title: "Villa avec Piscine", address: "42 Avenue des Pins, Nice", type: "villa", status: "available", price: 3500, bedrooms: 5, bathrooms: 3, area: 280, owner: "Marie Martin", image: "/placeholder.svg" },
  { id: 3, title: "Maison Familiale", address: "8 Rue du Lac, Lyon", type: "house", status: "sale", price: 450000, bedrooms: 4, bathrooms: 2, area: 150, owner: "Pierre Durand", image: "/placeholder.svg" },
  { id: 4, title: "Local Commercial", address: "120 Boulevard Haussmann, Paris", type: "commercial", status: "available", price: 5000, bedrooms: 0, bathrooms: 1, area: 200, owner: "Sophie Bernard", image: "/placeholder.svg" },
  { id: 5, title: "Studio Étudiant", address: "5 Place Bellecour, Lyon", type: "apartment", status: "rented", price: 650, bedrooms: 1, bathrooms: 1, area: 25, owner: "Luc Petit", image: "/placeholder.svg" },
  { id: 6, title: "Penthouse Vue Mer", address: "1 Promenade des Anglais, Nice", type: "apartment", status: "maintenance", price: 4500, bedrooms: 3, bathrooms: 2, area: 180, owner: "Emma Leroy", image: "/placeholder.svg" },
];

const typeConfig = {
  apartment: { label: "Appartement", icon: Building, color: "from-blue-500 to-indigo-500" },
  house: { label: "Maison", icon: Home, color: "from-emerald-500 to-cyan-500" },
  villa: { label: "Villa", icon: Castle, color: "from-purple-500 to-violet-500" },
  commercial: { label: "Commercial", icon: Warehouse, color: "from-orange-500 to-amber-500" },
};

const statusConfig = {
  available: { label: "Disponible", color: "bg-emerald-500/20 text-emerald-400" },
  rented: { label: "Loué", color: "bg-blue-500/20 text-blue-400" },
  sale: { label: "En vente", color: "bg-purple-500/20 text-purple-400" },
  maintenance: { label: "Maintenance", color: "bg-orange-500/20 text-orange-400" },
};

export default function Admin2Properties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || property.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Propriétés</h1>
          <p className="text-slate-400 mt-1">Gérez toutes les propriétés de la plateforme</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une propriété
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Ajouter une nouvelle propriété</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm text-slate-400">Titre</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="Appartement Moderne Centre-Ville" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm text-slate-400">Adresse</label>
                <Input className="bg-slate-800 border-slate-700" placeholder="15 Rue de la Paix, Paris" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Type de bien</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Statut</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="rented">Loué</SelectItem>
                    <SelectItem value="sale">En vente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Prix (€)</label>
                <Input className="bg-slate-800 border-slate-700" type="number" placeholder="1500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Surface (m²)</label>
                <Input className="bg-slate-800 border-slate-700" type="number" placeholder="65" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Chambres</label>
                <Input className="bg-slate-800 border-slate-700" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Salles de bain</label>
                <Input className="bg-slate-800 border-slate-700" type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Propriétaire</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Sélectionner un propriétaire" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="1">Jean Dupont</SelectItem>
                    <SelectItem value="2">Marie Martin</SelectItem>
                    <SelectItem value="3">Pierre Durand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Images</label>
                <Input className="bg-slate-800 border-slate-700" type="file" multiple />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm text-slate-400">Description</label>
                <Textarea className="bg-slate-800 border-slate-700 min-h-24" placeholder="Description détaillée de la propriété..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="border-slate-700 text-slate-300">
                Annuler
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">
                Ajouter la propriété
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, config]) => {
          const count = mockProperties.filter(p => p.type === key).length;
          return (
            <Card
              key={key}
              className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all duration-300 ${selectedType === key ? "ring-2 ring-emerald-500" : "hover:border-slate-600"}`}
              onClick={() => setSelectedType(selectedType === key ? "all" : key)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}>
                  <config.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-sm text-slate-400">{config.label}s</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Rechercher une propriété..."
            className="pl-10 bg-slate-800/50 border-slate-700/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50">
            <SelectValue placeholder="Type de bien" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="apartment">Appartements</SelectItem>
            <SelectItem value="house">Maisons</SelectItem>
            <SelectItem value="villa">Villas</SelectItem>
            <SelectItem value="commercial">Commerciaux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => {
          const type = typeConfig[property.type];
          const status = statusConfig[property.status];
          return (
            <Card key={property.id} className="bg-slate-800/50 border-slate-700/50 overflow-hidden group hover:border-slate-600 transition-all">
              <div className="relative h-48 bg-slate-700">
                <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                <Badge className={`absolute top-3 left-3 ${status.color}`}>{status.label}</Badge>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="bg-slate-900/80 hover:bg-slate-900">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300">
                        <Eye className="w-4 h-4 mr-2" /> Voir
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
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${type.color}`}>
                    <type.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs text-slate-400">{type.label}</span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-1">{property.title}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  {property.address}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4" /> {property.area}m²
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-400">{property.owner}</span>
                  <span className="text-xl font-bold text-emerald-400 flex items-center">
                    <Euro className="w-4 h-4" />
                    {property.price.toLocaleString()}
                    {property.status !== "sale" && <span className="text-sm text-slate-400">/mois</span>}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
