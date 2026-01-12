// src/features/admin-dashboard/pages/AdminSettings.jsx
import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  CreditCard,
  Database,
  Save,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Switch } from "../../../components/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import { Textarea } from "../../../components/Textarea";
import { toast } from "../../../hooks/UseToast";

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">
            Configurez les paramètres de la plateforme
          </p>
        </div>
        <Button
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Général</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Apparence</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Intégrations</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Facturation</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Informations de la plateforme</CardTitle>
                <CardDescription>
                  Paramètres généraux de votre instance ImmoGestion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Nom de la plateforme</Label>
                    <Input id="platform-name" defaultValue="ImmoGestion" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email administrateur</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@immogestion.fr" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Plateforme de gestion immobilière professionnelle"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="europe-paris">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (UTC)</SelectItem>
                        <SelectItem value="america-new-york">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue par défaut</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Paramètres des paiements</CardTitle>
                <CardDescription>
                  Configuration des règles de paiement par défaut
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-day">Jour de paiement par défaut</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 5, 10, 15, 20, 25].map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}er du mois
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="late-days">Jours avant retard</Label>
                    <Input id="late-days" type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels automatiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyer des rappels avant l'échéance
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment et quand recevoir des notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notifications par email</h4>
                {[
                  { label: "Nouveaux utilisateurs", desc: "Notification lors d'une inscription" },
                  { label: "Paiements en retard", desc: "Alertes pour les paiements non reçus" },
                  { label: "Demandes de maintenance", desc: "Nouvelles demandes urgentes" },
                  { label: "Rapports hebdomadaires", desc: "Résumé des activités chaque semaine" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Notifications push</h4>
                {[
                  { label: "Alertes critiques", desc: "Urgences et problèmes majeurs" },
                  { label: "Activité des gestionnaires", desc: "Actions importantes" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <Label>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Authentification</CardTitle>
                <CardDescription>
                  Paramètres de sécurité et d'accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Obliger la 2FA pour tous les admins
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Sessions multiples</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser les connexions simultanées
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label>Expiration de session (heures)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tentatives max avant blocage</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Journal d'activité</CardTitle>
                <CardDescription>
                  Suivi des actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Journalisation des connexions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enregistrer toutes les connexions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label>Journalisation des actions</Label>
                    <p className="text-sm text-muted-foreground">
                      Tracer les modifications de données
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Thème et apparence</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème par défaut</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Couleur principale</Label>
                <div className="flex gap-3">
                  {["#1e3a5f", "#0d9488", "#7c3aed", "#dc2626", "#ea580c"].map((color) => (
                    <button
                      key={color}
                      className="w-10 h-10 rounded-lg ring-2 ring-offset-2 ring-transparent hover:ring-primary transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer les animations de l'interface
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>Email (SMTP)</CardTitle>
                    <CardDescription>Configuration du serveur email</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Serveur SMTP</Label>
                    <Input placeholder="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input placeholder="587" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Utilisateur</Label>
                    <Input placeholder="user@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle>API & Webhooks</CardTitle>
                    <CardDescription>Intégrations avec des services tiers</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Clé API</Label>
                  <div className="flex gap-2">
                    <Input value="sk_live_••••••••••••••••" readOnly className="font-mono" />
                    <Button variant="outline">Régénérer</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL Webhook</Label>
                  <Input placeholder="https://your-app.com/webhook" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle>Plan et facturation</CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos factures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">Plan Enterprise</span>
                  <span className="text-2xl font-bold">€299/mois</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Utilisateurs illimités • 1000 propriétés • Support prioritaire
                </p>
              </div>
              <div className="space-y-2">
                <Label>Prochain renouvellement</Label>
                <p className="text-muted-foreground">15 Juillet 2024</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">Voir les factures</Button>
                <Button variant="outline">Changer de plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}