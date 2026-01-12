import { useState } from "react";
import {
  User,
  Bell,
  Lock,
  CreditCard,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Switch } from "../../../components/Switch";
import { Separator } from "../../../components/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { Textarea } from "../../../components/Textarea";
import PageHeader from "../components/PageHeader";

export default function OwnerSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <PageHeader
        title="Paramètres"
        description="Gérez vos préférences et informations personnelles"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Facturation</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    PM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">Changer la photo</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Pierre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Martin" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    defaultValue="pierre.martin@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-10"
                    defaultValue="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-10"
                    defaultValue="15 Rue de la République, 75001 Paris"
                  />
                </div>
              </div>

              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations société</CardTitle>
              <CardDescription>
                Si vous gérez vos biens via une société
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Nom de la société</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="company" className="pl-10" placeholder="SCI Martin" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input id="siret" placeholder="123 456 789 00012" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des alertes urgentes par SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes de paiement</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié des paiements et retards
                  </p>
                </div>
                <Switch
                  checked={paymentAlerts}
                  onCheckedChange={setPaymentAlerts}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié des demandes de maintenance
                  </p>
                </div>
                <Switch
                  checked={maintenanceAlerts}
                  onCheckedChange={setMaintenanceAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe régulièrement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Mettre à jour le mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">2FA non activée</p>
                  <p className="text-sm text-muted-foreground">
                    Protégez votre compte avec l'authentification à deux facteurs
                  </p>
                </div>
                <Button variant="outline">Activer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations bancaires</CardTitle>
              <CardDescription>
                Configurez votre compte pour recevoir les loyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" placeholder="FR76 1234 5678 9012 3456 7890 123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bic">BIC</Label>
                <Input id="bic" placeholder="BNPAFRPP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Nom de la banque</Label>
                <Input id="bank" placeholder="BNP Paribas" />
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Abonnement</CardTitle>
              <CardDescription>
                Gérez votre abonnement ImmoGestion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold">Plan Pro</p>
                  <p className="text-sm text-muted-foreground">
                    29€/mois • Jusqu'à 20 biens
                  </p>
                </div>
                <Button variant="outline">Gérer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}