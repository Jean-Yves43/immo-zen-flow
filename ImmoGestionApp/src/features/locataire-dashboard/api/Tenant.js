// tenant.js - Données et fonctions mock centralisées pour le locataire

// Données pour TenantDashboard
export const kpiCards = [
  {
    title: "Loyer mensuel",
    value: "850€",
    status: "Payé",
    statusColor: "success",
    icon: "Euro",
    iconColor: "bg-secondary/10 text-secondary",
  },
  {
    title: "Prochaine échéance",
    value: "1er Février",
    status: "Dans 24 jours",
    statusColor: "warning",
    icon: "Calendar",
    iconColor: "bg-warning/10 text-warning",
  },
  {
    title: "Mon logement",
    value: "Apt. Montmartre",
    status: "3 pièces • 65m²",
    statusColor: "muted",
    icon: "Home",
    iconColor: "bg-primary/10 text-primary",
  },
  {
    title: "Notifications",
    value: "3",
    status: "Non lues",
    statusColor: "destructive",
    icon: "Bell",
    iconColor: "bg-destructive/10 text-destructive",
  },
];

export const recentPayments = [
  {
    id: 1,
    month: "Janvier 2024",
    amount: "850€",
    date: "02/01/2024",
    status: "paid",
  },
  {
    id: 2,
    month: "Décembre 2023",
    amount: "850€",
    date: "01/12/2023",
    status: "paid",
  },
  {
    id: 3,
    month: "Novembre 2023",
    amount: "850€",
    date: "01/11/2023",
    status: "paid",
  },
  {
    id: 4,
    month: "Février 2024",
    amount: "850€",
    date: "01/02/2024",
    status: "upcoming",
  },
];

// Données pour TenantLogement
export const propertyDetails = [
  { label: "Type de bien", value: "Appartement", icon: "Home" },
  { label: "Surface", value: "65 m²", icon: "Ruler" },
  { label: "Pièces", value: "3 pièces", icon: "DoorOpen" },
  { label: "Étage", value: "3ème étage", icon: "Building" },
];

export const amenities = [
  { label: "Parking", available: true, icon: "Car" },
  { label: "Balcon", available: true, icon: "Fence" },
  { label: "Ascenseur", available: true, icon: "ArrowUpRight" },
  { label: "Cave", available: false, icon: "Waves" },
];

export const documents = [
  { name: "Contrat de location", type: "PDF", size: "2.4 MB", date: "15/01/2024" },
  { name: "Règlement intérieur", type: "PDF", size: "856 KB", date: "15/01/2024" },
  { name: "État des lieux", type: "PDF", size: "3.1 MB", date: "15/01/2024" },
];

// Données pour TenantMaintenance
export const maintenanceRequests = [
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

// Données pour TenantNotifications
export const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Paiement reçu",
    message: "Votre paiement de 850€ pour janvier 2024 a été confirmé.",
    date: "Il y a 2 heures",
    read: false,
    icon: "Euro",
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "maintenance",
    title: "Technicien assigné",
    message: "Jean Plombier interviendra le 20/01 pour la fuite du robinet.",
    date: "Il y a 5 heures",
    read: false,
    icon: "Wrench",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 3,
    type: "reminder",
    title: "Rappel : Loyer à venir",
    message: "Votre loyer de février 2024 sera dû dans 7 jours.",
    date: "Hier",
    read: false,
    icon: "Clock",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    id: 4,
    type: "document",
    title: "Nouveau document",
    message: "Votre quittance de décembre 2023 est disponible.",
    date: "3 janvier",
    read: true,
    icon: "FileText",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 5,
    type: "info",
    title: "Travaux programmés",
    message: "Des travaux de ravalement sont prévus du 15 au 20 février.",
    date: "2 janvier",
    read: true,
    icon: "Home",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

// Données pour TenantRecus
export const receipts = [
  {
    id: 1,
    month: "Janvier 2024",
    amount: "850,00 €",
    paymentDate: "02/01/2024",
    status: "paid",
  },
  {
    id: 2,
    month: "Décembre 2023",
    amount: "850,00 €",
    paymentDate: "01/12/2023",
    status: "paid",
  },
  {
    id: 3,
    month: "Novembre 2023",
    amount: "850,00 €",
    paymentDate: "01/11/2023",
    status: "paid",
  },
  {
    id: 4,
    month: "Octobre 2023",
    amount: "850,00 €",
    paymentDate: "01/10/2023",
    status: "paid",
  },
  {
    id: 5,
    month: "Septembre 2023",
    amount: "850,00 €",
    paymentDate: "04/09/2023",
    status: "late",
  },
  {
    id: 6,
    month: "Août 2023",
    amount: "850,00 €",
    paymentDate: "01/08/2023",
    status: "paid",
  },
];

// Fonctions utilitaires pour les badges
export const getPaymentStatusBadge = (status) => {
  switch (status) {
    case "paid":
      return {
        variant: "default",
        className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
        icon: "CheckCircle2",
        label: "Payé",
      };
    case "upcoming":
      return {
        variant: "default",
        className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
        icon: "Clock",
        label: "À venir",
      };
    case "late":
      return {
        variant: "default",
        className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
        icon: "AlertCircle",
        label: "En retard",
      };
    default:
      return null;
  }
};

export const getUrgencyBadge = (urgency) => {
  switch (urgency) {
    case "high":
      return {
        className: "bg-destructive/10 text-destructive border-destructive/20",
        icon: "AlertCircle",
        label: "Urgent",
      };
    case "medium":
      return {
        className: "bg-warning/10 text-warning border-warning/20",
        icon: "Clock",
        label: "Moyen",
      };
    default:
      return {
        className: "bg-muted text-muted-foreground",
        icon: null,
        label: "Normal",
      };
  }
};

export const getMaintenanceStatusBadge = (status) => {
  switch (status) {
    case "resolved":
      return {
        className: "bg-success/10 text-success border-success/20",
        icon: "CheckCircle2",
        label: "Résolu",
      };
    case "in_progress":
      return {
        className: "bg-secondary/10 text-secondary border-secondary/20",
        icon: "Clock",
        label: "En cours",
      };
    default:
      return {
        className: "bg-muted text-muted-foreground",
        icon: null,
        label: "En attente",
      };
  }
};

export const getReceiptStatusBadge = (status) => {
  if (status === "paid") {
    return {
      className: "bg-success/10 text-success border-success/20",
      icon: "CheckCircle2",
      label: "Payé",
    };
  }
  return {
    className: "bg-warning/10 text-warning border-warning/20",
    icon: null,
    label: "Payé en retard",
  };
};