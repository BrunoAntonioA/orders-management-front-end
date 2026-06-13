import { OrderStatus } from '../../orders/models/order.model';
import { DeliveryRoute } from '../../delivery/models/delivery.model';
import { Customer } from '../../../shared/models/customer.model';
import { OrderWithCustomer } from '../../orders/models/order.model';
import {
  ClientReportRow,
  DeliveryReportRow,
  LocationReportRow,
  ProductReportRow,
  ReportSnapshot,
  StatusBreakdown,
} from '../models/reports.model';

export function buildReportSnapshot(
  orders: OrderWithCustomer[],
  clients: Customer[],
  deliveries: DeliveryRoute[],
): ReportSnapshot {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total ?? 0), 0);
  const assignedOrders = orders.filter((order) => order.routeId).length;

  const statusMap = new Map<OrderStatus, StatusBreakdown>();
  for (const order of orders) {
    const current = statusMap.get(order.status) ?? {
      status: order.status,
      count: 0,
      revenue: 0,
    };
    current.count += 1;
    current.revenue += order.total ?? 0;
    statusMap.set(order.status, current);
  }

  const clientMap = new Map<string, ClientReportRow>();
  for (const order of orders) {
    const key = order.customerId;
    const current = clientMap.get(key) ?? {
      clientId: key,
      name: `${order.customer.firstName} ${order.customer.lastName}`,
      address: order.customer.address,
      orderCount: 0,
      revenue: 0,
    };
    current.orderCount += 1;
    current.revenue += order.total ?? 0;
    clientMap.set(key, current);
  }

  const locationMap = new Map<string, LocationReportRow & { clientIds: Set<string> }>();
  for (const order of orders) {
    const address = order.customer.address.trim();
    const current = locationMap.get(address) ?? {
      address,
      orderCount: 0,
      clientCount: 0,
      revenue: 0,
      clientIds: new Set<string>(),
    };
    current.orderCount += 1;
    current.revenue += order.total ?? 0;
    current.clientIds.add(order.customerId);
    locationMap.set(address, current);
  }

  const productMap = new Map<string, ProductReportRow>();
  for (const order of orders) {
    for (const item of order.items) {
      const current = productMap.get(item.product) ?? {
        product: item.product,
        quantity: 0,
        revenue: 0,
      };
      current.quantity += item.quantity;
      current.revenue += item.quantity * item.unitPrice;
      productMap.set(item.product, current);
    }
  }

  const deliveryRows: DeliveryReportRow[] = deliveries.map((delivery) => {
    const routeOrders = orders.filter((order) => order.routeId === delivery.id);
    return {
      id: delivery.id,
      label: delivery.name ?? `Delivery ${delivery.routeDate}`,
      routeDate: delivery.routeDate,
      status: delivery.status,
      driver: delivery.driver,
      orderCount: routeOrders.length,
      revenue: routeOrders.reduce((sum, order) => sum + (order.total ?? 0), 0),
    };
  });

  return {
    summary: {
      totalClients: clients.length,
      totalOrders: orders.length,
      totalRevenue,
      totalDeliveries: deliveries.length,
      unassignedOrders: orders.length - assignedOrders,
      assignedOrders,
      averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    },
    ordersByStatus: [...statusMap.values()].sort((a, b) => b.count - a.count),
    topClients: [...clientMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8),
    topLocations: [...locationMap.values()]
      .map(({ clientIds, ...row }) => ({ ...row, clientCount: clientIds.size }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 8),
    topProducts: [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 8),
    deliveries: deliveryRows.sort((a, b) => b.routeDate.localeCompare(a.routeDate)),
  };
}
