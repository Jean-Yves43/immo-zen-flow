import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Search, MapPin, Bed, Bath, Square, Edit, Trash2, Eye, MoreVertical,
  Home, Building, Castle, Warehouse, Building2,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  description: string;
  image: string;
}

const initialProperties: Property[] = [
  { id: 1, title: "Appartement Moderne Centre-Ville", address: "15 Rue de la Paix, Paris", type: "apartment", status: "rented", price: 1500, bedrooms: 2, bathrooms: 1, area: 65, owner: "Jean Dupont", description: "", image: "/placeholder.svg" },
  { id: 2, title: "Villa avec Piscine", address: "42 Avenue des Pins, Nice", type: "villa", status: "available", price: 3500, bedrooms: 5, bathrooms: 3, area: 280, owner: "Marie Martin", description: "", image: "/placeholder.svg" },
  { id: 3, title: "Maison Familiale", address: "8 Rue du Lac, Lyon", type: "house", status: "sale", price: 450000, bedrooms: 4, bathrooms: 2, area: 150, owner: "Pierre Durand", description: "", image: "/placeholder.svg" },
  { id: 4, title: "Local Commercial", address: "120 Boulevard Haussmann, Paris", type: "commercial", status: "available", price: 5000, bedrooms: 0, bathrooms: 1, area: 200, owner: "Sophie Bernard", description: "", image: "/placeholder.svg" },
  { id: 5, title: "Studio Étudiant", address: "5 Place Bellecour, Lyon", type: "apartment", status: "rented", price: 650, bedrooms: 1, bathrooms: 1, area: 25, owner: "Luc Petit", description: "", image: "/placeholder.svg" },
  { id: 6, title: "Penthouse Vue Mer", address: "1 Promenade des Anglais, Nice", type: "apartment", status: "maintenance", price: 4500, bedrooms: 3, bathrooms: 2, area: 180, owner: "Emma Leroy", description: "", image: "/placeholder.svg" },
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

const emptyForm = { title: "", address: "", type: "", status: "", price: "", bedrooms: "", bathrooms: "", area: "", owner: "", description: "" };

export default function Admin2Properties() {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const [viewProp, setViewProp] = useState<Property | null>(null);
  const [deleteProp, setDeleteProp] = useState<Property | null>(null);

  const isCreateRoute = location.pathname === "/admin2/properties/create";

  useEffect(() => {
    if (isCreateRoute) setIsCreateOpen(true);
  }, [isCreateRoute]);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || p.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreate = () => {
    if (!form.title || !form.address || !form.type || !form.price) { toast.error("Veuillez remplir tous les champs obligatoires"); return; }
    const newProp: Property = {
      id: Math.max(...properties.map(p => p.id), 0) + 1,
      title: form.title, address: form.address, type: form.type as Property["type"],
      status: (form.status || "available") as Property["status"],
      price: parseFloat(form.price), bedrooms: parseInt(form.bedrooms) || 0,
      bathrooms: parseInt(form.bathrooms) || 0, area: parseInt(form.area) || 0,
      owner: form.owner, description: form.description, image: "/placeholder.svg",
    };
    setProperties(prev => [...prev, newProp]);
    setForm(emptyForm); setIsCreateOpen(false);
    if (isCreateRoute) navigate("/admin2/properties");
    toast.success(`Propriété "${newProp.title}" ajoutée`);
  };

  const handleEdit = (prop: Property) => {
    setEditProp(prop);
    setForm({ title: prop.title, address: prop.address, type: prop.type, status: prop.status, price: String(prop.price), bedrooms: String(prop.bedrooms), bathrooms: String(prop.bathrooms), area: String(prop.area), owner: prop.owner, description: prop.description });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editProp) return;
    setProperties(prev => prev.map(p => p.id === editProp.id ? { ...p, title: form.title, address: form.address, type: form.type as Property["type"], status: form.status as Property["status"], price: parseFloat(form.price), bedrooms: parseInt(form.bedrooms) || 0, bathrooms: parseInt(form.bathrooms) || 0, area: parseInt(form.area) || 0, owner: form.owner, description: form.description } : p));
    setIsEditOpen(false); setEditProp(null); setForm(emptyForm);
    toast.success("Propriété modifiée avec succès");
  };

  const handleDelete = () => {
    if (!deleteProp) return;
    setProperties(prev => prev.filter(p => p.id !== deleteProp.id));
    setIsDeleteOpen(false); toast.success(`Propriété "${deleteProp.title}" supprimée`); setDeleteProp(null);
  };

  const renderForm = (onSubmit: () => void, submitLabel: string, onCancel: () => void) => (
    <>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="col-span-2 space-y-2"><label className="text-sm text-slate-400">Titre *</label><Input className="bg-slate-800 border-slate-700" placeholder="Appartement Moderne" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
        <div className="col-span-2 space-y-2"><label className="text-sm text-slate-400">Adresse *</label><Input className="bg-slate-800 border-slate-700" placeholder="15 Rue de la Paix, Paris" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Type *</label>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}><SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="apartment">Appartement</SelectItem><SelectItem value="house">Maison</SelectItem><SelectItem value="villa">Villa</SelectItem><SelectItem value="commercial">Commercial</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Statut</label>
          <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="available">Disponible</SelectItem><SelectItem value="rented">Loué</SelectItem><SelectItem value="sale">En vente</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><label className="text-sm text-slate-400">Prix (€) *</label><Input className="bg-slate-800 border-slate-700" type="number" placeholder="1500" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></div>
        <div className="space-y-2"><label className="text-sm text-slate-400">Surface (m²)</label><Input className="bg-slate-800 border-slate-700" type="number" placeholder="65" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} /></div>
        <div className="space-y-2"><label className="text-sm text-slate-400">Chambres</label><Input className="bg-slate-800 border-slate-700" type="number" placeholder="2" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} /></div>
        <div className="space-y-2"><label className="text-sm text-slate-400">Salles de bain</label><Input className="bg-slate-800 border-slate-700" type="number" placeholder="1" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} /></div>
        <div className="space-y-2"><label className="text-sm text-slate-400">Propriétaire</label><Input className="bg-slate-800 border-slate-700" placeholder="Jean Dupont" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} /></div>
        <div className="col-span-2 space-y-2"><label className="text-sm text-slate-400">Description</label><Textarea className="bg-slate-800 border-slate-700 min-h-24" placeholder="Description détaillée..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} className="border-slate-700 text-slate-300">Annuler</Button>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500" onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Propriétés</h1>
          <p className="text-slate-400 mt-1">{properties.length} propriétés au total</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white gap-2" onClick={() => { setForm(emptyForm); setIsCreateOpen(true); }}>
          <Plus className="w-4 h-4" />Ajouter une propriété
        </Button>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={o => { setIsCreateOpen(o); if (!o) { setForm(emptyForm); if (isCreateRoute) navigate("/admin2/properties"); } }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-xl">Ajouter une nouvelle propriété</DialogTitle></DialogHeader>
          {renderForm(handleCreate, "Ajouter la propriété", () => { setIsCreateOpen(false); setForm(emptyForm); if (isCreateRoute) navigate("/admin2/properties"); })}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={o => { setIsEditOpen(o); if (!o) { setEditProp(null); setForm(emptyForm); } }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-xl">Modifier la propriété</DialogTitle></DialogHeader>
          {renderForm(handleSaveEdit, "Enregistrer", () => { setIsEditOpen(false); setEditProp(null); setForm(emptyForm); })}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-xl">{viewProp?.title}</DialogTitle></DialogHeader>
          {viewProp && (
            <div className="mt-4 space-y-4">
              <div className="h-48 bg-slate-700 rounded-lg" />
              <div className="flex gap-2">
                <Badge className={statusConfig[viewProp.status].color}>{statusConfig[viewProp.status].label}</Badge>
                <Badge className="bg-slate-500/20 text-slate-300">{typeConfig[viewProp.type].label}</Badge>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-slate-800/50">
                <div className="flex justify-between"><span className="text-slate-400">Adresse</span><span className="text-white">{viewProp.address}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Prix</span><span className="text-emerald-400 font-bold">€{viewProp.price.toLocaleString()}{viewProp.status !== "sale" && "/mois"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Surface</span><span className="text-white">{viewProp.area}m²</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Chambres</span><span className="text-white">{viewProp.bedrooms}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">SdB</span><span className="text-white">{viewProp.bathrooms}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Propriétaire</span><span className="text-white">{viewProp.owner}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle className="text-xl">Confirmer la suppression</DialogTitle></DialogHeader>
          <p className="text-slate-400 mt-2">Supprimer <span className="text-white font-medium">"{deleteProp?.title}"</span> ? Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="border-slate-700" onClick={() => setIsDeleteOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(typeConfig).map(([key, config]) => {
          const count = properties.filter(p => p.type === key).length;
          return (
            <Card key={key} className={`bg-slate-800/50 border-slate-700/50 cursor-pointer transition-all duration-300 ${selectedType === key ? "ring-2 ring-emerald-500" : "hover:border-slate-600"}`} onClick={() => setSelectedType(selectedType === key ? "all" : key)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}><config.icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-2xl font-bold text-white">{count}</p><p className="text-sm text-slate-400">{config.label}s</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Rechercher..." className="pl-10 bg-slate-800/50 border-slate-700/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700/50"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="apartment">Appartements</SelectItem>
            <SelectItem value="house">Maisons</SelectItem>
            <SelectItem value="villa">Villas</SelectItem>
            <SelectItem value="commercial">Commerciaux</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
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
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="bg-slate-900/80 text-white"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      <DropdownMenuItem className="text-slate-300" onClick={() => { setViewProp(property); setIsViewOpen(true); }}><Eye className="w-4 h-4 mr-2" />Voir</DropdownMenuItem>
                      <DropdownMenuItem className="text-slate-300" onClick={() => handleEdit(property)}><Edit className="w-4 h-4 mr-2" />Modifier</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400" onClick={() => { setDeleteProp(property); setIsDeleteOpen(true); }}><Trash2 className="w-4 h-4 mr-2" />Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-slate-700 text-slate-300 text-xs">{type.label}</Badge>
                </div>
                <h3 className="font-semibold text-white mb-2">{property.title}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1 mb-4"><MapPin className="w-4 h-4" />{property.address}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{property.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{property.bathrooms}</span>
                  <span className="flex items-center gap-1"><Square className="w-4 h-4" />{property.area}m²</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-emerald-400 font-bold text-lg">€{property.price.toLocaleString()}{property.status !== "sale" && "/mois"}</span>
                  <span className="text-sm text-slate-400">{property.owner}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Aucune propriété trouvée</p>
        </div>
      )}
    </div>
  );
}
