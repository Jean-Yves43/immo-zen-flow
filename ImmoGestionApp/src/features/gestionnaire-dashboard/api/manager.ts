// manager.ts - Données et fonctions centralisées pour le gestionnaire

// ============================================================================
// TYPES
// ============================================================================

export type UrgencyLevel = "low" | "medium" | "high";
export type MaintenanceStatus = "pending" | "assigned" | "in_progress" | "completed";
export type PaymentStatus = "paid" | "pending" | "late";
export type PropertyStatus = "rented" | "vacant" | "for_sale";
export type NotificationType = "payment" | "maintenance" | "owner" | "property";

export interface Owner {
  id: number;
  name: string;
  email: string;
  properties: number;
  tenants: number;
  revenue: number;
  paymentRate: number;
}

export interface Property {
  id: number;
  name: string;
  owner: string;
  type: string;
  address: string;
  rent: number;
  status: PropertyStatus;
  tenant: string | null;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  property: string;
  owner: string;
  rent: number;
  status: PaymentStatus;
}

export interface Payment {
  id: number;
  tenant: string;
  owner: string;
  property: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
}

export interface MaintenanceRequest {
  id: number;
  title: string;
  property: string;
  owner: string;
  tenant: string;
  urgency: UrgencyLevel;
  status: MaintenanceStatus;
  provider: string | null;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  urgent: boolean;
}

export interface Alert {
  type: string;
  message: string;
  time: string;
  urgent: boolean;
}

export interface RevenueData {
  name: string;
  revenue: number;
}

export interface OccupancyData {
  month: string;
  rate: number;
}

export interface PropertyStatusData {
  name: string;
  value: number;
  color: string;
}

export interface PaymentStatusData {
  name: string;
  value: number;
  color: string;
}

// ============================================================================
// MOCK DATA - DASHBOARD
// ============================================================================

export const kpiCards = [
  { title: "Propriétaires gérés", value: "8", change: "+2", icon: "Users" },
  { title: "Biens sous gestion", value: "45", change: "+5", icon: "Home" },
  { title: "Paiements ce mois", value: "42/45", change: "93%", icon: "CreditCard" },
  { title: "Maintenances ouvertes", value: "7", change: "-2", icon: "Wrench" },
];

export const revenueByOwner: RevenueData[] = [
  { name: "Martin", revenue: 18450 },
  { name: "Durand", revenue: 12300 },
  { name: "Bernard", revenue: 9800 },
  { name: "Petit", revenue: 24500 },
  { name: "Robert", revenue: 5200 },
];

export const propertyStatus: PropertyStatusData[] = [
  { name: "Loués", value: 38, color: "hsl(var(--secondary))" },
  { name: "Vacants", value: 5, color: "hsl(var(--muted))" },
  { name: "En vente", value: 2, color: "hsl(var(--primary))" },
];

export const recentAlerts: Alert[] = [
  { type: "payment", message: "Loyer en retard - Jean Dupont", time: "Il y a 2h", urgent: true },
  { type: "maintenance", message: "Urgence plomberie - Apt Victor Hugo", time: "Il y a 4h", urgent: true },
  { type: "owner", message: "Nouveau propriétaire ajouté - M. Robert", time: "Hier", urgent: false },
  { type: "payment", message: "Paiement reçu - Marie Lambert", time: "Hier", urgent: false },
];

// ============================================================================
// MOCK DATA - MAINTENANCE
// ============================================================================

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: 1, title: "Fuite robinet", property: "Apt T3 - Victor Hugo", owner: "Pierre Martin", tenant: "Jean Dupont", urgency: "medium", status: "in_progress", provider: "Plombier Express", createdAt: "10 Jan 2024" },
  { id: 2, title: "Panne chauffage", property: "Studio - Leclerc", owner: "Pierre Martin", tenant: "Marie Lambert", urgency: "high", status: "pending", provider: null, createdAt: "12 Jan 2024" },
  { id: 3, title: "Serrure porte", property: "Maison T5 - Foch", owner: "Claire Durand", tenant: "Paul Bernard", urgency: "low", status: "completed", provider: "Serrurier Pro", createdAt: "05 Jan 2024" },
  { id: 4, title: "Volet bloqué", property: "T2 - Paix", owner: "Paul Bernard", tenant: "Sophie Martin", urgency: "low", status: "assigned", provider: "Multi-Services", createdAt: "08 Jan 2024" },
];

// ============================================================================
// MOCK DATA - STATISTICS
// ============================================================================

export const occupancyData: OccupancyData[] = [
  { month: "Jan", rate: 88 },
  { month: "Fév", rate: 90 },
  { month: "Mar", rate: 85 },
  { month: "Avr", rate: 92 },
  { month: "Mai", rate: 95 },
  { month: "Juin", rate: 93 },
];

export const paymentStatus: PaymentStatusData[] = [
  { name: "À temps", value: 42, color: "hsl(var(--secondary))" },
  { name: "En retard", value: 3, color: "hsl(var(--destructive))" },
];

// ============================================================================
// MOCK DATA - NOTIFICATIONS
// ============================================================================

export const initialNotifications: Notification[] = [
  { id: 1, type: "payment", title: "Loyer en retard", message: "Marie Lambert - Studio Leclerc", time: "Il y a 2h", read: false, urgent: true },
  { id: 2, type: "maintenance", title: "Urgence plomberie", message: "Apt T3 Victor Hugo - Fuite importante", time: "Il y a 4h", read: false, urgent: true },
  { id: 3, type: "owner", title: "Nouveau propriétaire", message: "M. Robert a accepté votre invitation", time: "Hier", read: false, urgent: false },
  { id: 4, type: "payment", title: "Paiement reçu", message: "Jean Dupont - 1200€", time: "Hier", read: true, urgent: false },
  { id: 5, type: "property", title: "Bien mis en vente", message: "T2 Rue de la Paix - 320 000€", time: "Il y a 2 jours", read: true, urgent: false },
];

// ============================================================================
// MOCK DATA - OWNERS
// ============================================================================

export const owners: Owner[] = [
  { id: 1, name: "Pierre Martin", email: "pierre.martin@email.com", properties: 12, tenants: 9, revenue: 18450, paymentRate: 95 },
  { id: 2, name: "Claire Durand", email: "claire.durand@email.com", properties: 8, tenants: 7, revenue: 12300, paymentRate: 100 },
  { id: 3, name: "Paul Bernard", email: "paul.bernard@email.com", properties: 5, tenants: 4, revenue: 9800, paymentRate: 88 },
  { id: 4, name: "Sophie Petit", email: "sophie.petit@email.com", properties: 15, tenants: 12, revenue: 24500, paymentRate: 92 },
  { id: 5, name: "Jean Robert", email: "jean.robert@email.com", properties: 5, tenants: 3, revenue: 5200, paymentRate: 100 },
];

// ============================================================================
// MOCK DATA - PAYMENTS
// ============================================================================

export const payments: Payment[] = [
  { id: 1, tenant: "Jean Dupont", owner: "Pierre Martin", property: "Apt T3 - Victor Hugo", amount: 1200, dueDate: "01 Jan 2024", status: "paid" },
  { id: 2, tenant: "Marie Lambert", owner: "Pierre Martin", property: "Studio - Leclerc", amount: 650, dueDate: "01 Jan 2024", status: "late" },
  { id: 3, tenant: "Paul Bernard", owner: "Claire Durand", property: "Maison T5 - Foch", amount: 3200, dueDate: "01 Jan 2024", status: "paid" },
  { id: 4, tenant: "Sophie Martin", owner: "Paul Bernard", property: "T2 - Paix", amount: 980, dueDate: "15 Jan 2024", status: "pending" },
  { id: 5, tenant: "Lucas Petit", owner: "Sophie Petit", property: "Loft - Marais", amount: 2100, dueDate: "01 Jan 2024", status: "paid" },
];

// ============================================================================
// MOCK DATA - PROPERTIES
// ============================================================================

export const properties: Property[] = [
  { id: 1, name: "Apt T3 - Rue Victor Hugo", owner: "Pierre Martin", type: "Appartement", address: "Paris 1er", rent: 1200, status: "rented", tenant: "Jean Dupont" },
  { id: 2, name: "Studio - Rue Leclerc", owner: "Pierre Martin", type: "Studio", address: "Paris 15e", rent: 650, status: "vacant", tenant: null },
  { id: 3, name: "Maison T5 - Avenue Foch", owner: "Claire Durand", type: "Maison", address: "Paris 16e", rent: 3200, status: "rented", tenant: "Marie Lambert" },
  { id: 4, name: "T2 - Rue de la Paix", owner: "Paul Bernard", type: "Appartement", address: "Paris 2e", rent: 980, status: "for_sale", tenant: null },
  { id: 5, name: "Loft - Rue du Marais", owner: "Sophie Petit", type: "Loft", address: "Paris 4e", rent: 2100, status: "rented", tenant: "Lucas Petit" },
];

// ============================================================================
// MOCK DATA - TENANTS
// ============================================================================

export const tenants: Tenant[] = [
  { id: 1, name: "Jean Dupont", email: "jean@email.com", property: "Apt T3 - Victor Hugo", owner: "Pierre Martin", rent: 1200, status: "paid" },
  { id: 2, name: "Marie Lambert", email: "marie@email.com", property: "Studio - Leclerc", owner: "Pierre Martin", rent: 650, status: "late" },
  { id: 3, name: "Paul Bernard", email: "paul@email.com", property: "Maison T5 - Foch", owner: "Claire Durand", rent: 3200, status: "paid" },
  { id: 4, name: "Sophie Martin", email: "sophie@email.com", property: "T2 - Paix", owner: "Paul Bernard", rent: 980, status: "pending" },
  { id: 5, name: "Lucas Petit", email: "lucas@email.com", property: "Loft - Marais", owner: "Sophie Petit", rent: 2100, status: "paid" },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const calculateTotalRevenue = (data: RevenueData[]): number => {
  return data.reduce((sum, d) => sum + d.revenue, 0);
};

export const calculateAverageOccupancy = (data: OccupancyData[]): number => {
  return Math.round(data.reduce((sum, d) => sum + d.rate, 0) / data.length);
};

export const getUniqueOwners = (props: Property[]): string[] => {
  return [...new Set(props.map((p) => p.owner))];
};

export const filterBySearch = <T extends { name?: string; title?: string; property?: string; owner?: string }>(
  items: T[],
  searchQuery: string
): T[] => {
  const query = searchQuery.toLowerCase();
  return items.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const title = item.title?.toLowerCase() || "";
    const property = item.property?.toLowerCase() || "";
    const owner = item.owner?.toLowerCase() || "";
    return name.includes(query) || title.includes(query) || property.includes(query) || owner.includes(query);
  });
};

export const filterByStatus = <T extends { status: string }>(
  items: T[],
  statusFilter: string
): T[] => {
  if (statusFilter === "all") return items;
  return items.filter((item) => item.status === statusFilter);
};

export const filterByOwner = (props: Property[], ownerFilter: string): Property[] => {
  if (ownerFilter === "all") return props;
  return props.filter((p) => p.owner === ownerFilter);
};