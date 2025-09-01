import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = `http://localhost:5000/api/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/category/${encodeURIComponent(category)}`
    );
  }

  searchProducts(params: { [key: string]: string }): Observable<Product[]> {
    const queryString = new URLSearchParams(params).toString();
    return this.http.get<Product[]>(`${this.apiUrl}/search?${queryString}`);
  }
}