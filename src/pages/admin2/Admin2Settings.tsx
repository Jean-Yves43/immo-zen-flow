import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Settings, Bell, Megaphone, Shield, Globe, Palette, Mail, MessageSquare, Smartphone, Save,
  Plus, Edit, Trash2, Key, Lock, Users, Eye, EyeOff, CheckCircle, XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Ad {
  id: number;
  title: string;
  status: "active" | "paused";
  placement: string;
  impressions: number;
  clicks: number;
  url: string;
}

const initialAds: Ad[] = [
  { id: 1, title: "Promotion Été", status: "active", placement: "homepage", impressions: 45000, clicks: 1250, url: "" },
  { id: 2, title: "Nouveau Service", status: "paused", placement: "sidebar", impressions: 12000, clicks: 450, url: "" },
  { id: 3, title: "Partenaire Assurance", status: "active", placement: "property", impressions: 28000, clicks: 890, url: "" },
];

export default function Admin2Settings() {
  const [settings, setSettings] = useState({
    siteName: "ImmoGestion", siteUrl: "https://immogestion.fr", contactEmail: "contact@immogestion.fr",
    language: "fr", maintenanceMode: false, registrationEnabled: true, emailVerification: true,
    twoFactorAuth: false, sessionTimeout: 30, maxLoginAttempts: 5,
    emailNotifications: true, pushNotifications: true, smsNotifications: false,
    paymentReminders: true, maintenanceAlerts: true, newUserNotifications: true,
    theme: "emerald",
  });
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [isEditAdOpen, setIsEditAdOpen] = useState(false);
  const [isDeleteAdOpen, setIsDeleteAdOpen] = useState(false);
  const [adForm, setAdForm] = useState({ title: "", placement: "", status: "active", url: "" });
  const [editAd, setEditAd] = useState<Ad | null>(null);
  const [deleteAd, setDeleteAd] = useState<Ad | null>(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("Paramètres sauvegardés avec succès");
  };

  const handleCreateAd = () => {
    if (!adForm.title || !adForm.placement) { toast.error("Remplissez les champs obligatoires"); return; }
    const a: Ad = { id: Math.max(...ads.map(a => a.id), 0) + 1, title: adForm.title, status: adForm.status as "active" | "paused", placement: adForm.placement, impressions: 0, clicks: 0, url: adForm.url };
    setAds(prev => [...prev, a]);
    setAdForm({ title: "", placement: "", status: "active", url: "" });
    setIsAdDialogOpen(false);
    toast.success(`Publicité "${a.title}" créée`);
  };

  const handleEditAd = (ad: Ad) => {
    setEditAd(ad);
    setAdForm({ title: ad.title, placement: ad.placement, status: ad.status, url: ad.url });
    setIsEditAdOpen(true);
  };

  const handleSaveEditAd = () => {
    if (!editAd) return;
    setAds(prev => prev.map(a => a.id === editAd.id ? { ...a, title: adForm.title, placement: adForm.placement, status: adForm.status as "active" | "paused", url: adForm.url } : a));
    setIsEditAdOpen(false);
    setEditAd(null);
    toast.success("Publicité modifiée");
  };

  const handleDeleteAd = () => {
    if (!deleteAd) return;
    setAds(prev => prev.filter(a => a.id !== deleteAd.id));
    setIsDeleteAdOpen(false);
    toast.success(`Publicité "${deleteAd.title}" supprimée`);
    setDeleteAd(null);
  };

  const handleToggleAdStatus = (id: number) => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a));
    toast.success("Statut mis à jour");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_live_1234567890abcdef");
    toast.success("Clé API copiée");
  };

  const handleRegenerateApiKey = () => {
    toast.success("Clé API régénérée avec succès");
  };

  const adFormRender = (onSubmit: () => void, label: string, onCancel: () => void) => (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="col-span-2 space-y-2">
        <label className="text-sm text-slate-400">Titre *</label>
        <Input className="bg-slate-800 border-slate-700" placeholder="Promotion Été 2024" value={adForm.title} onChange={e => setAdForm(f => ({ ...f, title: e.target.value }))} />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Emplacement *</label>
        <Select value={adForm.placement} onValueChange={v => setAdForm(f => ({ ...f, placement: v }))}>
          <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="homepage">Page d'accueil</SelectItem>
            <SelectItem value="sidebar">Barre latérale</SelectItem>
            <SelectItem value="property">Page propriété</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-400">Statut</label>
        <Select value={adForm.status} onValueChange={v => setAdForm(f => ({ ...f, status: v }))}>
          <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="paused">En pause</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-2">
        <label className="text-sm text-slate-400">URL de destination</label>
        <Input className="bg-slate-800 border-slate-700" placeholder="https://..." value={adForm.url} onChange={e => setAdForm(f => ({ ...f, url: e.target.value }))} />
      </div>
      <div className="col-span-2 flex justify-end gap-3 mt-4">
        <Button variant="outline" className="border-slate-700" onClick={onCancel}>Annuler</Button>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500" onClick={onSubmit}>{label}</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
          <p className="text-slate-400 mt-1">Configurez les paramètres de votre plateforme</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 gap-2" onClick={handleSave}><Save className="w-4 h-4" />Sauvegarder</Button>
      </div>

      {/* Edit Ad Dialog */}
      <Dialog open={isEditAdOpen} onOpenChange={o => { setIsEditAdOpen(o); if (!o) setEditAd(null); }}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
          <DialogHeader><DialogTitle>Modifier la publicité</DialogTitle></DialogHeader>
          {adFormRender(handleSaveEditAd, "Enregistrer", () => { setIsEditAdOpen(false); setEditAd(null); })}
        </DialogContent>
      </Dialog>

      {/* Delete Ad Dialog */}
      <Dialog open={isDeleteAdOpen} onOpenChange={setIsDeleteAdOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle></DialogHeader>
          <p className="text-slate-400 mt-2">Supprimer la publicité <span className="text-white font-medium">"{deleteAd?.title}"</span> ?</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="border-slate-700" onClick={() => setIsDeleteAdOpen(false)}>Annuler</Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteAd}>Supprimer</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500 gap-2"><Settings className="w-4 h-4" /> Général</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500 gap-2"><Bell className="w-4 h-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-emerald-500 gap-2"><Megaphone className="w-4 h-4" /> Publicités</TabsTrigger>
          <TabsTrigger value="auth" className="data-[state=active]:bg-emerald-500 gap-2"><Shield className="w-4 h-4" /> Authentification</TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-emerald-500 gap-2"><Key className="w-4 h-4" /> API & Intégrations</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" />Paramètres du Site</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-slate-400">Nom du site</label><Input className="bg-slate-900 border-slate-700" value={settings.siteName} onChange={e => handleChange("siteName", e.target.value)} /></div>
                <div className="space-y-2"><label className="text-sm text-slate-400">URL du site</label><Input className="bg-slate-900 border-slate-700" value={settings.siteUrl} onChange={e => handleChange("siteUrl", e.target.value)} /></div>
                <div className="space-y-2"><label className="text-sm text-slate-400">Email de contact</label><Input className="bg-slate-900 border-slate-700" value={settings.contactEmail} onChange={e => handleChange("contactEmail", e.target.value)} /></div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Langue par défaut</label>
                  <Select value={settings.language} onValueChange={v => handleChange("language", v)}>
                    <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div><p className="text-white font-medium">Mode maintenance</p><p className="text-sm text-slate-400">Activez pour mettre le site en maintenance</p></div>
                <Switch checked={settings.maintenanceMode} onCheckedChange={v => handleChange("maintenanceMode", v)} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Palette className="w-5 h-5 text-purple-400" />Apparence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "emerald", label: "Thème Émeraude", gradient: "from-emerald-500 to-cyan-500" },
                  { id: "ocean", label: "Thème Océan", gradient: "from-blue-500 to-purple-500" },
                  { id: "sunset", label: "Thème Sunset", gradient: "from-orange-500 to-red-500" },
                ].map(theme => (
                  <div key={theme.id} className={`p-4 rounded-lg bg-slate-900/50 cursor-pointer transition-all ${settings.theme === theme.id ? "border-2 border-emerald-500" : "border border-slate-700 hover:border-slate-500"}`} onClick={() => { handleChange("theme", theme.id); toast.success(`Thème "${theme.label}" sélectionné`); }}>
                    <div className={`w-full h-20 rounded bg-gradient-to-br ${theme.gradient} mb-2`} />
                    <p className={`text-sm text-center ${settings.theme === theme.id ? "text-white" : "text-slate-400"}`}>{theme.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" />Canaux de Notification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailNotifications", icon: Mail, label: "Notifications Email", desc: "Recevoir les notifications par email" },
                { key: "pushNotifications", icon: Bell, label: "Notifications Push", desc: "Notifications dans le navigateur" },
                { key: "smsNotifications", icon: Smartphone, label: "Notifications SMS", desc: "Recevoir des SMS pour les alertes urgentes" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-slate-400" />
                    <div><p className="text-white font-medium">{item.label}</p><p className="text-sm text-slate-400">{item.desc}</p></div>
                  </div>
                  <Switch checked={settings[item.key as keyof typeof settings] as boolean} onCheckedChange={v => handleChange(item.key, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-400" />Types de Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "paymentReminders", label: "Rappels de paiement", desc: "Envoyer des rappels avant la date d'échéance" },
                { key: "maintenanceAlerts", label: "Alertes maintenance", desc: "Notifications pour les demandes de maintenance" },
                { key: "newUserNotifications", label: "Nouveaux utilisateurs", desc: "Notification lors de nouvelles inscriptions" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                  <div><p className="text-white font-medium">{item.label}</p><p className="text-sm text-slate-400">{item.desc}</p></div>
                  <Switch checked={settings[item.key as keyof typeof settings] as boolean} onCheckedChange={v => handleChange(item.key, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads */}
        <TabsContent value="ads" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-orange-400" />Gestion des Publicités</CardTitle>
              <Dialog open={isAdDialogOpen} onOpenChange={o => { setIsAdDialogOpen(o); if (!o) setAdForm({ title: "", placement: "", status: "active", url: "" }); }}>
                <DialogTrigger asChild><Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 gap-2"><Plus className="w-4 h-4" />Nouvelle publicité</Button></DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                  <DialogHeader><DialogTitle>Créer une publicité</DialogTitle></DialogHeader>
                  {adFormRender(handleCreateAd, "Créer", () => { setIsAdDialogOpen(false); setAdForm({ title: "", placement: "", status: "active", url: "" }); })}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded bg-slate-700" />
                      <div><p className="text-white font-medium">{ad.title}</p><p className="text-sm text-slate-400">{ad.placement}</p></div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center"><p className="text-white font-medium">{ad.impressions.toLocaleString()}</p><p className="text-xs text-slate-400">Impressions</p></div>
                      <div className="text-center"><p className="text-white font-medium">{ad.clicks.toLocaleString()}</p><p className="text-xs text-slate-400">Clics</p></div>
                      <Badge className={`cursor-pointer ${ad.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`} onClick={() => handleToggleAdStatus(ad.id)}>
                        {ad.status === "active" ? "Actif" : "En pause"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={() => handleEditAd(ad)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" onClick={() => { setDeleteAd(ad); setIsDeleteAdOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
                {ads.length === 0 && <p className="text-center text-slate-400 py-8">Aucune publicité</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auth */}
        <TabsContent value="auth" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" />Inscription & Connexion</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "registrationEnabled", label: "Inscription ouverte", desc: "Permettre aux nouveaux utilisateurs de s'inscrire" },
                { key: "emailVerification", label: "Vérification email", desc: "Exiger la vérification de l'email" },
                { key: "twoFactorAuth", label: "Authentification 2 facteurs", desc: "Exiger 2FA pour tous les utilisateurs" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                  <div><p className="text-white font-medium">{item.label}</p><p className="text-sm text-slate-400">{item.desc}</p></div>
                  <Switch checked={settings[item.key as keyof typeof settings] as boolean} onCheckedChange={v => handleChange(item.key, v)} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Lock className="w-5 h-5 text-amber-400" />Sécurité</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm text-slate-400">Expiration de session (minutes)</label><Input className="bg-slate-900 border-slate-700" type="number" value={settings.sessionTimeout} onChange={e => handleChange("sessionTimeout", parseInt(e.target.value) || 0)} /></div>
                <div className="space-y-2"><label className="text-sm text-slate-400">Tentatives de connexion max</label><Input className="bg-slate-900 border-slate-700" type="number" value={settings.maxLoginAttempts} onChange={e => handleChange("maxLoginAttempts", parseInt(e.target.value) || 0)} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader><CardTitle className="text-white flex items-center gap-2"><Key className="w-5 h-5 text-emerald-400" />Clés API</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">Clé API principale</p>
                  <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>{showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input className="bg-slate-800 border-slate-700 font-mono" value={showApiKey ? "sk_live_1234567890abcdef" : "••••••••••••••••"} readOnly />
                  <Button variant="outline" className="border-slate-700" onClick={handleCopyApiKey}>Copier</Button>
                  <Button variant="outline" className="border-slate-700 text-amber-400" onClick={handleRegenerateApiKey}>Régénérer</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Stripe", connected: true, desc: "Paiements connectés" },
                  { name: "PayPal", connected: false, desc: "Non configuré" },
                  { name: "SendGrid", connected: true, desc: "Emails configurés" },
                  { name: "Twilio", connected: false, desc: "Non configuré" },
                ].map(service => (
                  <div key={service.name} className="p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      {service.connected ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                      <p className="text-white font-medium">{service.name}</p>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{service.desc}</p>
                    <Button variant="outline" size="sm" className="border-slate-700" onClick={() => toast.info(`Configuration ${service.name} - Fonctionnalité de simulation`)}>{service.connected ? "Configurer" : "Connecter"}</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
