// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class BuyerDashboardService {
//   private apiUrl = 'http://localhost:5000/api';

//   constructor(private http: HttpClient) {}

//   // Products
//   getAllProducts(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/products/all`);
//   }

//   getProductsByCategory(category: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/products/category/${encodeURIComponent(category)}`);
//   }

//   searchProducts(params: any): Observable<any[]> {
//     const qs = new URLSearchParams(params).toString();
//     return this.http.get<any[]>(`${this.apiUrl}/products/search?${qs}`);
//   }

//   // Cart API
//   getCart(email: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/cart/${encodeURIComponent(email)}`);
//   }

//   addOrUpdateCart(buyerEmail: string, product: any, qty: number = 1) {
//     // product is object; backend cart stores name, price, imageUrl too
//     const body = {
//       buyerEmail,
//       productId: product._id,
//       name: product.name,
//       price: product.price,
//       imageUrl: product.imageUrl || product.imageUrl || '',
//       quantity: qty
//     };
//     return this.http.post(`${this.apiUrl}/cart`, body);
//   }

//   updateCartQuantity(buyerEmail: string, productId: string, quantity: number) {
//     return this.http.put(`${this.apiUrl}/cart`, { buyerEmail, productId, quantity });
//   }

//   removeFromCart(buyerEmail: string, productId: string) {
//     return this.http.delete(`${this.apiUrl}/cart/${encodeURIComponent(buyerEmail)}/${encodeURIComponent(productId)}`);
//   }

//   clearCart(buyerEmail: string) {
//     return this.http.delete(`${this.apiUrl}/cart/${encodeURIComponent(buyerEmail)}`);
//   }

//   // Orders
//   placeOrders(orders: any[]) {
//     return this.http.post(`${this.apiUrl}/orders`, orders);
//   }

//   // Other handy helpers
//   getProductsByVendor(email: string) {
//     return this.http.get<any[]>(`${this.apiUrl}/products/by-vendor/${encodeURIComponent(email)}`);
//   }

//   addProductFormData(formData: FormData) {
//     return this.http.post(`${this.apiUrl}/products/add`, formData);
//   }

//   updateProductFormData(id: string, formData: FormData) {
//     return this.http.put(`${this.apiUrl}/products/update/${id}`, formData);
//   }


//   deleteProduct(id: string) {
//     return this.http.delete(`${this.apiUrl}/products/${id}`);
//   }
// }
