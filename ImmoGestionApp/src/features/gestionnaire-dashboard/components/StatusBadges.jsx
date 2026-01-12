// src/features/gestionnaire-dashboard/components/StatusBadges.jsx
import { Clock, CheckCircle, AlertTriangle, Wrench, User } from "lucide-react";
import { Badge } from "../../../components/Badge";

// Badge pour les statuts de paiement
export function PaymentStatusBadge({ status }) {
  const configs = {
    paid: { 
      class: "bg-secondary text-secondary-foreground", 
      icon: CheckCircle, 
      text: "Payé" 
    },
    late: { 
      class: "", 
      variant: "destructive", 
      icon: AlertTriangle, 
      text: "En retard" 
    },
    pending: { 
      class: "", 
      variant: "outline", 
      icon: Clock, 
      text: "En attente" 
    }
  };

  const config = configs[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={config.class} variant={config.variant}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
}

// Badge pour les urgences de maintenance
export function UrgencyBadge({ urgency }) {
  const configs = {
    high: { variant: "destructive", text: "Urgent" },
    medium: { 
      variant: "outline", 
      class: "border-orange-500 text-orange-500", 
      text: "Moyen" 
    },
    low: { variant: "outline", text: "Faible" }
  };

  const config = configs[urgency];
  if (!config) return null;

  return (
    <Badge variant={config.variant} className={config.class}>
      {config.text}
    </Badge>
  );
}

// Badge pour les statuts de maintenance
export function MaintenanceStatusBadge({ status }) {
  const configs = {
    pending: { 
      variant: "outline", 
      icon: Clock, 
      text: "En attente" 
    },
    assigned: { 
      class: "bg-primary text-primary-foreground", 
      icon: User, 
      text: "Assigné" 
    },
    in_progress: { 
      variant: "outline", 
      class: "border-orange-500 text-orange-500", 
      icon: Wrench, 
      text: "En cours" 
    },
    completed: { 
      class: "bg-secondary text-secondary-foreground", 
      icon: CheckCircle, 
      text: "Terminé" 
    }
  };

  const config = configs[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge className={config.class} variant={config.variant}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
}

// Badge pour les statuts de propriété
export function PropertyStatusBadge({ status }) {
  const configs = {
    rented: { 
      class: "bg-secondary text-secondary-foreground", 
      text: "Loué" 
    },
    vacant: { 
      variant: "outline", 
      text: "Vacant" 
    },
    for_sale: { 
      class: "bg-primary text-primary-foreground", 
      text: "En vente" 
    }
  };

  const config = configs[status];
  if (!config) return null;

  return (
    <Badge className={config.class} variant={config.variant}>
      {config.text}
    </Badge>
  );
}