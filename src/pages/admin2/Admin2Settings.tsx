import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Settings,
  Bell,
  Megaphone,
  Shield,
  Globe,
  Palette,
  Mail,
  MessageSquare,
  Smartphone,
  Save,
  Plus,
  Edit,
  Trash2,
  Key,
  Lock,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock data for ads
const mockAds = [
  { id: 1, title: "Promotion Été", status: "active", placement: "homepage", impressions: 45000, clicks: 1250 },
  { id: 2, title: "Nouveau Service", status: "paused", placement: "sidebar", impressions: 12000, clicks: 450 },
  { id: 3, title: "Partenaire Assurance", status: "active", placement: "property", impressions: 28000, clicks: 890 },
];

export default function Admin2Settings() {
  const [settings, setSettings] = useState({
    siteName: "ImmoGestion",
    siteUrl: "https://immogestion.fr",
    contactEmail: "contact@immogestion.fr",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceAlerts: true,
    newUserNotifications: true,
  });

  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
          <p className="text-slate-400 mt-1">Configurez les paramètres de votre plateforme</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500 gap-2">
            <Settings className="w-4 h-4" /> Général
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500 gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="ads" className="data-[state=active]:bg-emerald-500 gap-2">
            <Megaphone className="w-4 h-4" /> Publicités
          </TabsTrigger>
          <TabsTrigger value="auth" className="data-[state=active]:bg-emerald-500 gap-2">
            <Shield className="w-4 h-4" /> Authentification
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-emerald-500 gap-2">
            <Key className="w-4 h-4" /> API & Intégrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Paramètres du Site
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Nom du site</label>
                  <Input
                    className="bg-slate-900 border-slate-700"
                    value={settings.siteName}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">URL du site</label>
                  <Input
                    className="bg-slate-900 border-slate-700"
                    value={settings.siteUrl}
                    onChange={(e) => handleChange("siteUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Email de contact</label>
                  <Input
                    className="bg-slate-900 border-slate-700"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Langue par défaut</label>
                  <Select defaultValue="fr">
                    <SelectTrigger className="bg-slate-900 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Mode maintenance</p>
                  <p className="text-sm text-slate-400">Activez pour mettre le site en maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(v) => handleChange("maintenanceMode", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50 border-2 border-emerald-500 cursor-pointer">
                  <div className="w-full h-20 rounded bg-gradient-to-br from-emerald-500 to-cyan-500 mb-2" />
                  <p className="text-sm text-white text-center">Thème Émeraude</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 cursor-pointer hover:border-slate-500">
                  <div className="w-full h-20 rounded bg-gradient-to-br from-blue-500 to-purple-500 mb-2" />
                  <p className="text-sm text-slate-400 text-center">Thème Océan</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 cursor-pointer hover:border-slate-500">
                  <div className="w-full h-20 rounded bg-gradient-to-br from-orange-500 to-red-500 mb-2" />
                  <p className="text-sm text-slate-400 text-center">Thème Sunset</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Canaux de Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Notifications Email</p>
                    <p className="text-sm text-slate-400">Recevoir les notifications par email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => handleChange("emailNotifications", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Notifications Push</p>
                    <p className="text-sm text-slate-400">Notifications dans le navigateur</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(v) => handleChange("pushNotifications", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-white font-medium">Notifications SMS</p>
                    <p className="text-sm text-slate-400">Recevoir des SMS pour les alertes urgentes</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(v) => handleChange("smsNotifications", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                Types de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Rappels de paiement</p>
                  <p className="text-sm text-slate-400">Envoyer des rappels avant la date d'échéance</p>
                </div>
                <Switch
                  checked={settings.paymentReminders}
                  onCheckedChange={(v) => handleChange("paymentReminders", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Alertes maintenance</p>
                  <p className="text-sm text-slate-400">Notifications pour les demandes de maintenance</p>
                </div>
                <Switch
                  checked={settings.maintenanceAlerts}
                  onCheckedChange={(v) => handleChange("maintenanceAlerts", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Nouveaux utilisateurs</p>
                  <p className="text-sm text-slate-400">Notification lors de nouvelles inscriptions</p>
                </div>
                <Switch
                  checked={settings.newUserNotifications}
                  onCheckedChange={(v) => handleChange("newUserNotifications", v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ads Settings */}
        <TabsContent value="ads" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-orange-400" />
                Gestion des Publicités
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 gap-2">
                    <Plus className="w-4 h-4" />
                    Nouvelle publicité
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer une publicité</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm text-slate-400">Titre de la publicité</label>
                      <Input className="bg-slate-800 border-slate-700" placeholder="Promotion Été 2024" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Emplacement</label>
                      <Select>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="homepage">Page d'accueil</SelectItem>
                          <SelectItem value="sidebar">Barre latérale</SelectItem>
                          <SelectItem value="property">Page propriété</SelectItem>
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
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="paused">En pause</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm text-slate-400">URL de destination</label>
                      <Input className="bg-slate-800 border-slate-700" placeholder="https://..." />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm text-slate-400">Image</label>
                      <Input className="bg-slate-800 border-slate-700" type="file" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" className="border-slate-700">Annuler</Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500">Créer</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAds.map((ad) => (
                  <div key={ad.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded bg-slate-700" />
                      <div>
                        <p className="text-white font-medium">{ad.title}</p>
                        <p className="text-sm text-slate-400">{ad.placement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-white font-medium">{ad.impressions.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Impressions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">{ad.clicks.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Clics</p>
                      </div>
                      <Badge className={ad.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>
                        {ad.status === "active" ? "Actif" : "En pause"}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auth Settings */}
        <TabsContent value="auth" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Inscription & Connexion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Inscription ouverte</p>
                  <p className="text-sm text-slate-400">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(v) => handleChange("registrationEnabled", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Vérification email</p>
                  <p className="text-sm text-slate-400">Exiger la vérification de l'email</p>
                </div>
                <Switch
                  checked={settings.emailVerification}
                  onCheckedChange={(v) => handleChange("emailVerification", v)}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                <div>
                  <p className="text-white font-medium">Authentification 2 facteurs</p>
                  <p className="text-sm text-slate-400">Exiger 2FA pour tous les utilisateurs</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(v) => handleChange("twoFactorAuth", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-400" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Expiration de session (minutes)</label>
                  <Input
                    className="bg-slate-900 border-slate-700"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Tentatives de connexion max</label>
                  <Input
                    className="bg-slate-900 border-slate-700"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                Clés API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">Clé API principale</p>
                  <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    className="bg-slate-800 border-slate-700 font-mono"
                    value={showApiKey ? "sk_live_1234567890abcdef" : "••••••••••••••••"}
                    readOnly
                  />
                  <Button variant="outline" className="border-slate-700">Copier</Button>
                  <Button variant="outline" className="border-slate-700 text-amber-400">Régénérer</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <p className="text-white font-medium">Stripe</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Paiements connectés</p>
                  <Button variant="outline" size="sm" className="border-slate-700">Configurer</Button>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <p className="text-white font-medium">PayPal</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Non configuré</p>
                  <Button variant="outline" size="sm" className="border-slate-700">Connecter</Button>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <p className="text-white font-medium">SendGrid</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Emails configurés</p>
                  <Button variant="outline" size="sm" className="border-slate-700">Configurer</Button>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-slate-400" />
                    <p className="text-white font-medium">Twilio</p>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">Non configuré</p>
                  <Button variant="outline" size="sm" className="border-slate-700">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
