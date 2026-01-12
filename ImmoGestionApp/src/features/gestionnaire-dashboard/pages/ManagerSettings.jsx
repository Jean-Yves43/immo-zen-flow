// src/features/gestionnaire-dashboard/pages/ManagerSettings.jsx
import { useState } from "react";
import { User, Bell, Lock, Save, Mail, Phone, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { Label } from "../../../components/Label";
import { Switch } from "../../../components/Switch";
import { Separator } from "../../../components/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/Tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/Avatar";
import { PageHeader } from "../components/PageHeader";

export default function ManagerSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Paramètres"
        description="Gérez vos préférences"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
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
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Mettez à jour vos informations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    MG
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
                  <Label>Prénom</Label>
                  <Input defaultValue="Marc" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input defaultValue="Gestionnaire" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    className="pl-10" 
                    defaultValue="marc@immogestion.fr" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10" 
                    defaultValue="06 98 76 54 32" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Société</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-10" 
                    defaultValue="ImmoGestion SARL" 
                  />
                </div>
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

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

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Mot de passe actuel</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirmer</Label>
                <Input type="password" />
              </div>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Mettre à jour
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}