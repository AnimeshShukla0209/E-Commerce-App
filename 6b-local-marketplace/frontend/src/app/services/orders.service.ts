import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, DeliveryStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:5000/api/vendor-orders';

  constructor(private http: HttpClient) {}

  getVendorOrders(vendorEmail: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?email=${encodeURIComponent(vendorEmail)}`);
  }

  updateDeliveryStatus(orderId: string, deliveryStatus: DeliveryStatus): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/update-delivery/${orderId}`, { deliveryStatus });
  }
}