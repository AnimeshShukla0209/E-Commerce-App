// src/app/services/order-tracking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order.model'; // Your given model

@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {
  private apiUrl = 'http://localhost:3000/api/orders'; // Replace with your backend orders API

  constructor(private http: HttpClient) {}

  getOrderStatus(orderId: string): Observable<{
    status: Order['deliveryStatus'];
    location: { lat: number; lng: number };
  }> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`).pipe(
      map(order => ({
        status: order.deliveryStatus, // Use actual status from DB
        // Still using random location for now
        location: {
          lat: 17.385044 + Math.random() * 0.01,
          lng: 78.486671 + Math.random() * 0.01
        }
      }))
    );
  }
}
