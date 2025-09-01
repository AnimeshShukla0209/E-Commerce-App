import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RefundService {
  private apiUrl = 'http://localhost:5000/api/refund';

  constructor(private http: HttpClient) {}

  getPendingRefunds(vendorEmail: string) {
    return this.http.get(`${this.apiUrl}/pending?email=${encodeURIComponent(vendorEmail)}`);
  }

  processRefund(orderId: string) {
    return this.http.put(`${this.apiUrl}/${orderId}/process`, {});
  }
}