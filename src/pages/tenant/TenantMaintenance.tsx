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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const maintenanceRequests = [
  {
    id: 1,
    title: "Fuite robinet cuisine",
    type: "Plomberie",
    urgency: "medium",
    status: "in_progress",
    date: "15/01/2024",
    description: "Le robinet de la cuisine fuit légèrement",
    assignedTo: "Jean Plombier",
    timeline: [
      { step: "Demande soumise", date: "15/01/2024", completed: true },
      { step: "En cours de traitement", date: "16/01/2024", completed: true },
      { step: "Technicien assigné", date: "17/01/2024", completed: true },
      { step: "Intervention prévue", date: "20/01/2024", completed: false },
    ],
  },
  {
    id: 2,
    title: "Chauffage défaillant",
    type: "Chauffage",
    urgency: "high",
    status: "resolved",
    date: "10/01/2024",
    description: "Le radiateur du salon ne chauffe plus",
    timeline: [
      { step: "Demande soumise", date: "10/01/2024", completed: true },
      { step: "En cours de traitement", date: "10/01/2024", completed: true },
      { step: "Technicien assigné", date: "11/01/2024", completed: true },
      { step: "Résolu", date: "12/01/2024", completed: true },
    ],
  },
];

const getUrgencyBadge = (urgency: string) => {
  switch (urgency) {
    case "high":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="w-3 h-3 mr-1" />
          Urgent
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          <Clock className="w-3 h-3 mr-1" />
          Moyen
        </Badge>
      );
    default:
      return (
        <Badge className="bg-muted text-muted-foreground">
          Normal
        </Badge>
      );
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "resolved":
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Résolu
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
          <Clock className="w-3 h-3 mr-1" />
          En cours
        </Badge>
      );
    default:
      return (
        <Badge className="bg-muted text-muted-foreground">
          En attente
        </Badge>
      );
  }
};

export default function TenantMaintenance() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<typeof maintenanceRequests[0] | null>(null);

  const handleSubmit = () => {
    setIsDialogOpen(false);
    toast({
      title: "Demande envoyée ! 🔧",
      description: "Votre demande de maintenance a été enregistrée.",
    });
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
                    {getUrgencyBadge(request.urgency)}
                    {getStatusBadge(request.status)}
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
                  {getStatusBadge(request.status)}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
