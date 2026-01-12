import { useState } from "react";
import {
  Wrench,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Label } from "../../../components/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/Select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/Dialog";
import { toast } from "../../../hooks/UseToast";
import { maintenanceRequests, getUrgencyBadge, getMaintenanceStatusBadge } from "../api/tenant";

const iconMap = {
  AlertCircle,
  Clock,
  CheckCircle2,
};

export default function TenantMaintenance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSubmit = () => {
    setIsDialogOpen(false);
    toast({
      title: "Demande envoyée ! 🔧",
      description: "Votre demande de maintenance a été enregistrée.",
    });
  };

  const renderUrgencyBadge = (urgency) => {
    const badgeConfig = getUrgencyBadge(urgency);
    if (!badgeConfig) return null;

    const Icon = badgeConfig.icon ? iconMap[badgeConfig.icon] : null;
    return (
      <Badge className={badgeConfig.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {badgeConfig.label}
      </Badge>
    );
  };

  const renderStatusBadge = (status) => {
    const badgeConfig = getMaintenanceStatusBadge(status);
    if (!badgeConfig) return null;

    const Icon = badgeConfig.icon ? iconMap[badgeConfig.icon] : null;
    return (
      <Badge className={badgeConfig.className}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {badgeConfig.label}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            Signalez un problème ou suivez vos demandes en cours
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary-light">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Signaler un problème</DialogTitle>
              <DialogDescription>
                Décrivez le problème rencontré dans votre logement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type de problème</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plomberie</SelectItem>
                    <SelectItem value="electricity">Électricité</SelectItem>
                    <SelectItem value="heating">Chauffage</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Niveau d'urgence</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Normal</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Décrivez le problème en détail..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Photo (optionnel)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-secondary transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Cliquez pour ajouter une photo
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                className="flex-1 bg-secondary hover:bg-secondary-light"
                onClick={handleSubmit}
              >
                Soumettre la demande
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Demandes en cours
          </h2>
          {maintenanceRequests
            .filter((r) => r.status !== "resolved")
            .map((request, index) => (
              <Card
                key={request.id}
                className={`border-border/50 shadow-soft cursor-pointer transition-all hover:shadow-medium hover:-translate-y-1 animate-fade-up ${
                  selectedRequest?.id === request.id ? "ring-2 ring-secondary" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedRequest(request)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.type} • {request.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderUrgencyBadge(request.urgency)}
                    {renderStatusBadge(request.status)}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Request Details / Timeline */}
        <Card className="border-border/50 shadow-soft h-fit animate-fade-up animation-delay-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {selectedRequest ? "Suivi de la demande" : "Sélectionnez une demande"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRequest ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.description}
                  </p>
                </div>

                {selectedRequest.assignedTo && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Technicien assigné
                      </p>
                      <p className="font-medium">{selectedRequest.assignedTo}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Progression</h4>
                  <div className="relative">
                    {selectedRequest.timeline.map((step, index) => (
                      <div key={index} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed
                                ? "bg-success text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {index < selectedRequest.timeline.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 mt-2 ${
                                step.completed ? "bg-success" : "bg-border"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`font-medium ${
                              step.completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.step}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Cliquez sur une demande pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resolved Requests */}
      <Card className="border-border/50 shadow-soft animate-fade-up animation-delay-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Demandes résolues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintenanceRequests
              .filter((r) => r.status === "resolved")
              .map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {request.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.type} • Résolu le{" "}
                        {request.timeline[request.timeline.length - 1].date}
                      </p>
                    </div>
                  </div>
                  {renderStatusBadge(request.status)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}