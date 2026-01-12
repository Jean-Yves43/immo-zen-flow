// owner.js - Données et fonctions mock centralisées

export const kpiCards = [
  {
    title: "Mes biens",
    value: "12",
    change: "+2",
    trend: "up",
    icon: "Home",
    description: "biens immobiliers",
  },
  {
    title: "Revenus mensuels",
    value: "18 450 €",
    change: "+8.2%",
    trend: "up",
    icon: "TrendingUp",
    description: "vs mois dernier",
  },
  {
    title: "Loyers en retard",
    value: "2",
    change: "-1",
    trend: "down",
    icon: "AlertTriangle",
    description: "paiements en attente",
  },
  {
    title: "Maintenance en cours",
    value: "4",
    change: "+2",
    trend: "up",
    icon: "Wrench",
    description: "demandes actives",
  },
];

export const revenueData = [
  { month: "Jan", revenue: 15200 },
  { month: "Fév", revenue: 16800 },
  { month: "Mar", revenue: 15900 },
  { month: "Avr", revenue: 17200 },
  { month: "Mai", revenue: 18100 },
  { month: "Juin", revenue: 18450 },
];

export const occupancyData = [
  { name: "Loués", value: 9, color: "hsl(var(--secondary))" },
  { name: "Vacants", value: 2, color: "hsl(var(--muted))" },
  { name: "En vente", value: 1, color: "hsl(var(--primary))" },
];

export const paymentDelayData = [
  { month: "Jan", onTime: 10, late: 2 },
  { month: "Fév", onTime: 11, late: 1 },
  { month: "Mar", onTime: 9, late: 3 },
  { month: "Avr", onTime: 10, late: 2 },
  { month: "Mai", onTime: 11, late: 1 },
  { month: "Juin", onTime: 10, late: 2 },
];

export const recentPayments = [
  { tenant: "Jean Dupont", property: "Apt 3B - Rue Victor Hugo", amount: 850, status: "paid", date: "15 Jan 2024" },
  { tenant: "Marie Lambert", property: "Studio - Rue Leclerc", amount: 520, status: "late", date: "En retard" },
  { tenant: "Paul Bernard", property: "T3 - Avenue Foch", amount: 1200, status: "paid", date: "14 Jan 2024" },
  { tenant: "Sophie Martin", property: "T2 - Rue de la Paix", amount: 780, status: "pending", date: "Échéance: 20 Jan" },
];

export const maintenanceRequests = [
  {
    id: 1,
    title: "Fuite robinet cuisine",
    property: "Apt T3 - Rue Victor Hugo",
    tenant: "Jean Dupont",
    urgency: "medium",
    status: "in_progress",
    provider: "Plombier Express",
    createdAt: "10 Jan 2024",
    description: "Le robinet de la cuisine fuit depuis 2 jours.",
  },
  {
    id: 2,
    title: "Panne chauffage",
    property: "Studio - Rue Leclerc",
    tenant: "Marie Lambert",
    urgency: "high",
    status: "pending",
    provider: null,
    createdAt: "12 Jan 2024",
    description: "Le chauffage ne fonctionne plus du tout.",
  },
  {
    id: 3,
    title: "Serrure porte entrée",
    property: "Maison T5 - Avenue Foch",
    tenant: "Paul Bernard",
    urgency: "low",
    status: "completed",
    provider: "Serrurier Pro",
    createdAt: "05 Jan 2024",
    description: "La serrure est difficile à tourner.",
  },
  {
    id: 4,
    title: "Volet roulant bloqué",
    property: "T2 - Rue de la Paix",
    tenant: "Sophie Martin",
    urgency: "low",
    status: "assigned",
    provider: "Multi-Services",
    createdAt: "08 Jan 2024",
    description: "Le volet de la chambre est bloqué en position haute.",
  },
];

export const providers = [
  { id: 1, name: "Plombier Express", specialty: "Plomberie", phone: "06 11 22 33 44" },
  { id: 2, name: "Électricité Plus", specialty: "Électricité", phone: "06 22 33 44 55" },
  { id: 3, name: "Serrurier Pro", specialty: "Serrurerie", phone: "06 33 44 55 66" },
  { id: 4, name: "Multi-Services", specialty: "Général", phone: "06 44 55 66 77" },
];

export const payments = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    amount: 1200,
    dueDate: "01 Jan 2024",
    paidDate: "02 Jan 2024",
    status: "paid",
    method: "Virement",
  },
  {
    id: 2,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    amount: 650,
    dueDate: "01 Jan 2024",
    paidDate: null,
    status: "late",
    method: null,
  },
  {
    id: 3,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    amount: 3200,
    dueDate: "01 Jan 2024",
    paidDate: "01 Jan 2024",
    status: "paid",
    method: "Prélèvement",
  },
  {
    id: 4,
    tenant: "Sophie Martin",
    property: "T2 - Rue de la Paix",
    amount: 980,
    dueDate: "15 Jan 2024",
    paidDate: null,
    status: "pending",
    method: null,
  },
  {
    id: 5,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    amount: 2100,
    dueDate: "01 Jan 2024",
    paidDate: "01 Jan 2024",
    status: "paid",
    method: "Virement",
  },
  {
    id: 6,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    amount: 1200,
    dueDate: "01 Dec 2023",
    paidDate: "01 Dec 2023",
    status: "paid",
    method: "Virement",
  },
  {
    id: 7,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    amount: 650,
    dueDate: "01 Dec 2023",
    paidDate: "05 Dec 2023",
    status: "paid",
    method: "Virement",
  },
];

export const properties = [
  {
    id: 1,
    name: "Appartement T3 - Rue Victor Hugo",
    type: "Appartement",
    address: "15 Rue Victor Hugo, 75001 Paris",
    surface: 72,
    rooms: 3,
    rent: 1200,
    status: "rented",
    tenant: "Jean Dupont",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Studio - Rue Leclerc",
    type: "Studio",
    address: "8 Rue Leclerc, 75015 Paris",
    surface: 28,
    rooms: 1,
    rent: 650,
    status: "vacant",
    tenant: null,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Maison T5 - Avenue Foch",
    type: "Maison",
    address: "42 Avenue Foch, 75016 Paris",
    surface: 150,
    rooms: 5,
    rent: 3200,
    status: "rented",
    tenant: "Marie Lambert",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "T2 - Rue de la Paix",
    type: "Appartement",
    address: "23 Rue de la Paix, 75002 Paris",
    surface: 45,
    rooms: 2,
    rent: 980,
    status: "for_sale",
    tenant: null,
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Loft - Rue du Marais",
    type: "Loft",
    address: "5 Rue du Marais, 75004 Paris",
    surface: 95,
    rooms: 3,
    rent: 2100,
    status: "rented",
    tenant: "Paul Bernard",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    name: "T4 - Boulevard Haussmann",
    type: "Appartement",
    address: "78 Boulevard Haussmann, 75008 Paris",
    surface: 110,
    rooms: 4,
    rent: 2800,
    status: "rented",
    tenant: "Sophie Martin",
    image: "/placeholder.svg",
  },
];

// Fonctions utilitaires
export const getUrgencyBadge = (urgency) => {
  switch (urgency) {
    case "high":
      return { variant: "destructive", label: "Urgent" };
    case "medium":
      return { variant: "outline", className: "border-orange-500 text-orange-500", label: "Moyen" };
    case "low":
      return { variant: "outline", label: "Faible" };
    default:
      return null;
  }
};

export const getStatusBadge = (status, context = "maintenance") => {
  if (context === "maintenance") {
    switch (status) {
      case "pending":
        return { variant: "outline", icon: "Clock", label: "En attente" };
      case "assigned":
        return { variant: "default", className: "bg-primary text-primary-foreground", icon: "User", label: "Assigné" };
      case "in_progress":
        return { variant: "outline", className: "border-orange-500 text-orange-500", icon: "Wrench", label: "En cours" };
      case "completed":
        return { variant: "default", className: "bg-secondary text-secondary-foreground", icon: "CheckCircle", label: "Terminé" };
      default:
        return null;
    }
  }
  
  if (context === "payment") {
    switch (status) {
      case "paid":
        return { variant: "default", className: "bg-secondary text-secondary-foreground", icon: "CheckCircle", label: "Payé" };
      case "late":
        return { variant: "destructive", icon: "AlertTriangle", label: "En retard" };
      case "pending":
        return { variant: "outline", icon: "Clock", label: "En attente" };
      default:
        return null;
    }
  }
  
  if (context === "property") {
    switch (status) {
      case "rented":
        return { variant: "default", className: "bg-secondary text-secondary-foreground", label: "Loué" };
      case "vacant":
        return { variant: "outline", label: "Vacant" };
      case "for_sale":
        return { variant: "default", className: "bg-primary text-primary-foreground", label: "En vente" };
      default:
        return null;
    }
  }
};

export const filterItems = (items, searchQuery, searchFields, statusFilter, statusField = "status") => {
  return items.filter((item) => {
    const matchesSearch = searchFields.some(field => 
      item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === "all" || item[statusField] === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

// Données pour la page Receipts
export const receipts = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    month: "Janvier 2024",
    amount: 1200,
    date: "02 Jan 2024",
    type: "receipt",
  },
  {
    id: 2,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    month: "Janvier 2024",
    amount: 3200,
    date: "01 Jan 2024",
    type: "receipt",
  },
  {
    id: 3,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    month: "Janvier 2024",
    amount: 2100,
    date: "01 Jan 2024",
    type: "receipt",
  },
  {
    id: 4,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    month: "Décembre 2023",
    amount: 1200,
    date: "01 Dec 2023",
    type: "receipt",
  },
  {
    id: 5,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    month: "Décembre 2023",
    amount: 650,
    date: "05 Dec 2023",
    type: "receipt",
  },
];

export const contracts = [
  {
    id: 1,
    tenant: "Jean Dupont",
    property: "Apt T3 - Rue Victor Hugo",
    startDate: "01 Jan 2023",
    endDate: "31 Dec 2024",
    status: "active",
    type: "contract",
  },
  {
    id: 2,
    tenant: "Marie Lambert",
    property: "Studio - Rue Leclerc",
    startDate: "01 Jul 2023",
    endDate: "30 Jun 2024",
    status: "expiring",
    type: "contract",
  },
  {
    id: 3,
    tenant: "Paul Bernard",
    property: "Maison T5 - Avenue Foch",
    startDate: "01 Apr 2023",
    endDate: "31 Mar 2025",
    status: "active",
    type: "contract",
  },
  {
    id: 4,
    tenant: "Sophie Martin",
    property: "T2 - Rue de la Paix",
    startDate: "15 Sep 2023",
    endDate: "15 Sep 2024",
    status: "active",
    type: "contract",
  },
  {
    id: 5,
    tenant: "Lucas Petit",
    property: "Loft - Rue du Marais",
    startDate: "01 Mar 2023",
    endDate: "28 Feb 2025",
    status: "active",
    type: "contract",
  },
];

// Données pour la page Sales
export const propertiesForSale = [
  {
    id: 1,
    name: "T2 - Rue de la Paix",
    type: "Appartement",
    address: "23 Rue de la Paix, 75002 Paris",
    surface: 45,
    rooms: 2,
    price: 320000,
    pricePerMeter: 7111,
    status: "for_sale",
    listedDate: "01 Jan 2024",
    views: 145,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Studio - Montmartre",
    type: "Studio",
    address: "8 Rue Lepic, 75018 Paris",
    surface: 22,
    rooms: 1,
    price: 185000,
    pricePerMeter: 8409,
    status: "for_sale",
    listedDate: "15 Dec 2023",
    views: 89,
    image: "/placeholder.svg",
  },
];

export const rentedProperties = [
  {
    id: 3,
    name: "Apt T3 - Rue Victor Hugo",
    type: "Appartement",
    address: "15 Rue Victor Hugo, 75001 Paris",
    surface: 72,
    rooms: 3,
    estimatedPrice: 520000,
    status: "rented",
    tenant: "Jean Dupont",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Maison T5 - Avenue Foch",
    type: "Maison",
    address: "42 Avenue Foch, 75016 Paris",
    surface: 150,
    rooms: 5,
    estimatedPrice: 1850000,
    status: "rented",
    tenant: "Paul Bernard",
    image: "/placeholder.svg",
  },
];

// Données pour la page Statistics
export const revenueDataFull = [
  { month: "Jan", revenue: 15200, expenses: 2100 },
  { month: "Fév", revenue: 16800, expenses: 1800 },
  { month: "Mar", revenue: 15900, expenses: 3200 },
  { month: "Avr", revenue: 17200, expenses: 2400 },
  { month: "Mai", revenue: 18100, expenses: 1900 },
  { month: "Juin", revenue: 18450, expenses: 2200 },
  { month: "Juil", revenue: 17800, expenses: 2600 },
  { month: "Août", revenue: 16500, expenses: 1500 },
  { month: "Sep", revenue: 18200, expenses: 2800 },
  { month: "Oct", revenue: 19100, expenses: 2100 },
  { month: "Nov", revenue: 18800, expenses: 2400 },
  { month: "Déc", revenue: 19500, expenses: 3500 },
];

export const occupancyDataFull = [
  { month: "Jan", rate: 85 },
  { month: "Fév", rate: 88 },
  { month: "Mar", rate: 82 },
  { month: "Avr", rate: 90 },
  { month: "Mai", rate: 92 },
  { month: "Juin", rate: 95 },
];

export const propertyPerformance = [
  { name: "Apt T3 - Victor Hugo", revenue: 14400, occupancy: 100 },
  { name: "Studio - Leclerc", revenue: 7800, occupancy: 100 },
  { name: "Maison T5 - Foch", revenue: 38400, occupancy: 100 },
  { name: "T2 - Paix", revenue: 0, occupancy: 0 },
  { name: "Loft - Marais", revenue: 25200, occupancy: 100 },
];

export const expenseBreakdown = [
  { name: "Maintenance", value: 35, color: "hsl(var(--primary))" },
  { name: "Assurance", value: 25, color: "hsl(var(--secondary))" },
  { name: "Taxes", value: 20, color: "hsl(var(--muted))" },
  { name: "Gestion", value: 15, color: "hsl(220 70% 50%)" },
  { name: "Autres", value: 5, color: "hsl(280 70% 50%)" },
];

// Données pour la page Tenants
export const tenants = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "06 12 34 56 78",
    property: "Apt T3 - Rue Victor Hugo",
    rent: 1200,
    paymentStatus: "paid",
    leaseEnd: "31 Dec 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Marie Lambert",
    email: "marie.lambert@email.com",
    phone: "06 23 45 67 89",
    property: "Studio - Rue Leclerc",
    rent: 650,
    paymentStatus: "late",
    leaseEnd: "30 Jun 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Paul Bernard",
    email: "paul.bernard@email.com",
    phone: "06 34 56 78 90",
    property: "Maison T5 - Avenue Foch",
    rent: 3200,
    paymentStatus: "paid",
    leaseEnd: "31 Mar 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    phone: "06 45 67 89 01",
    property: "T2 - Rue de la Paix",
    rent: 980,
    paymentStatus: "pending",
    leaseEnd: "15 Sep 2024",
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Lucas Petit",
    email: "lucas.petit@email.com",
    phone: "06 56 78 90 12",
    property: "Loft - Rue du Marais",
    rent: 2100,
    paymentStatus: "paid",
    leaseEnd: "28 Feb 2025",
    avatar: "/placeholder.svg",
  },
];