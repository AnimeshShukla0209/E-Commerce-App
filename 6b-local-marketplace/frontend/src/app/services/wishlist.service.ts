import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistItem, AddToWishlistRequest } from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `http://localhost:5000/api/wishlist`;

  constructor(private http: HttpClient) {}

  getWishlist(userEmail: string): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/${encodeURIComponent(userEmail)}`);
  }

  addToWishlist(request: AddToWishlistRequest): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(this.apiUrl, request);
  }

  removeFromWishlist(userEmail: string, productId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${encodeURIComponent(userEmail)}/${encodeURIComponent(productId)}`
    );
  }
}