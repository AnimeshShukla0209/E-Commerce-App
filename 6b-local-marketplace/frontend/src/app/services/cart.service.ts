import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem, AddToCartRequest, UpdateCartQuantityRequest } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `http://localhost:5000/api/cart`;

  constructor(private http: HttpClient) {}

  getCart(userEmail: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/${encodeURIComponent(userEmail)}`);
  }

  addToCart(request: AddToCartRequest): Observable<CartItem> {
    return this.http.post<CartItem>(this.apiUrl, {
      userEmail: request.userEmail,
      productId: request.productId,
      quantity: request.quantity || 1
    });
  }

  updateQuantity(request: UpdateCartQuantityRequest): Observable<CartItem> {
    return this.http.put<CartItem>(this.apiUrl, request);
  }

  removeFromCart(userEmail: string, productId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${encodeURIComponent(userEmail)}/${encodeURIComponent(productId)}`
    );
  }
}