import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order, DeliveryStatus } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-orders.component.html',
  styleUrls: ['./vendor-orders.component.css']
})
export class VendorOrdersComponent implements OnInit {
  ordersGroupedByBuyer: { buyerEmail: string; orders: Order[] }[] = [];
  loading = false;
  errorMessage = '';

  constructor(private router: Router, private ordersService: OrdersService) {}

  ngOnInit(): void {
    const vendorEmail = localStorage.getItem('email');
    if (!vendorEmail) {
      this.errorMessage = 'Vendor email not found. Please login again.';
      return;
    }
    this.loadOrders(vendorEmail);
  }

  loadOrders(vendorEmail: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.ordersService.getVendorOrders(vendorEmail).subscribe({
      next: (orders: Order[]) => {
        this.loading = false;
        this.ordersGroupedByBuyer = this.groupOrdersByBuyer(orders);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load orders. Please try again later.';
        console.error('Error loading orders:', err);
      }
    });
  }

  groupOrdersByBuyer(orders: Order[]): { buyerEmail: string; orders: Order[] }[] {
    const groups: { [buyerEmail: string]: Order[] } = {};

    orders.forEach(order => {
      if (!groups[order.buyerEmail]) {
        groups[order.buyerEmail] = [];
      }
      groups[order.buyerEmail].push(order);
    });

    return Object.entries(groups).map(([buyerEmail, orders]) => ({ buyerEmail, orders }));
  }

  isStatusUpdateDisabled(order: Order): boolean {
    return ['cancelled', 'refunded', 'refund_pending'].includes(order.status);
  }

  updateDeliveryStatus(orderId: string, newStatus: DeliveryStatus): void {
    this.ordersService.updateDeliveryStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        // Update the local order state
        this.ordersGroupedByBuyer = this.ordersGroupedByBuyer.map(group => ({
          ...group,
          orders: group.orders.map(order => 
            order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
          )
        }));
      },
      error: (err) => {
        console.error('Failed to update delivery status:', err);
        // Revert the UI change
        this.loadOrders(localStorage.getItem('email') || '');
      }
    });
  }
  getProductImage(imageUrl: string | undefined): string {
  // If no image URL provided, return default
  if (!imageUrl) return 'assets/default-product.png';
  
  // Remove any leading/trailing quotes if present
  imageUrl = imageUrl.replace(/^['"]|['"]$/g, '');
  
  // Check if it's already a full URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Handle local server paths
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:5000${imageUrl}`;
  }
  
  // Default case - prepend uploads path
  return `http://localhost:5000/uploads/${imageUrl}`;
}
  routeToVendorDashboard(): void {
    this.router.navigate(['/vendor-dashboard']);
  }
}