import { OrderStatus } from '../../orders/models/order.model';

export interface ReportSummary {
  totalClients: number;
  totalOrders: number;
  totalRevenue: number;
  totalDeliveries: number;
  unassignedOrders: number;
  assignedOrders: number;
  averageOrderValue: number;
}

export interface StatusBreakdown {
  status: OrderStatus;
  count: number;
  revenue: number;
}

export interface ClientReportRow {
  clientId: string;
  name: string;
  address: string;
  orderCount: number;
  revenue: number;
}

export interface LocationReportRow {
  address: string;
  orderCount: number;
  clientCount: number;
  revenue: number;
}

export interface ProductReportRow {
  product: string;
  quantity: number;
  revenue: number;
}

export interface DeliveryReportRow {
  id: string;
  label: string;
  routeDate: string;
  status: string;
  driver?: string;
  orderCount: number;
  revenue: number;
}

export interface ReportSnapshot {
  summary: ReportSummary;
  ordersByStatus: StatusBreakdown[];
  topClients: ClientReportRow[];
  topLocations: LocationReportRow[];
  topProducts: ProductReportRow[];
  deliveries: DeliveryReportRow[];
}
