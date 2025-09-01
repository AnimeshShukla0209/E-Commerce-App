import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  userEmail: string = '';

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userEmail = user.email || '';
        if (this.userEmail) {
          this.loadCart();
        }
      }
    }
  }

  loadCart() {
    this.cartService.getCart(this.userEmail).subscribe({
      next: (data: CartItem[]) => {
        this.cartItems = data.map((item: CartItem) => ({
          ...item,
          imageUrl: item.productId.imageUrl
            ? item.productId.imageUrl.startsWith('http')
              ? item.productId.imageUrl
              : `http://localhost:5000/${item.productId.imageUrl.replace(/^\/+/, '')}`
            : '/assets/default-product.png'
        }));
      },
      error: (err: HttpErrorResponse) => console.error('Failed to load cart:', err)
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  }

  removeItem(index: number) {
    const item = this.cartItems[index];
    this.cartService.removeFromCart(this.userEmail, item.productId._id).subscribe({
      next: () => {
        this.cartItems.splice(index, 1);
        this.loadCart();
      },
      error: (err: HttpErrorResponse) => console.error('Remove from cart failed:', err)
    });
  }
  routeToBuyerDashboard()
  {
      this.router.navigate(['/buyer-dashboard']);
  }
  checkout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('default-product.png')) {
      img.src = '/assets/default-product.png';
    }
  }
}