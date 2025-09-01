import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { WishlistService } from '../../services/wishlist.service';
import { WishlistItem } from '../../models/wishlist.model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wishlist',
  standalone: true,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  imports: [CommonModule] // Removed RouterLink, RouterOutlet
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  userEmail: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private wishlistService: WishlistService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userEmail = user.email || '';
        if (this.userEmail) {
          this.loadWishlist();
        }
      }
    }
  }

  loadWishlist() {
    this.wishlistService.getWishlist(this.userEmail).subscribe({
      next: (data: WishlistItem[]) => {
        this.wishlistItems = data.map((item: WishlistItem) => ({
          ...item,
          imageUrl: item.productId.imageUrl
            ? item.productId.imageUrl.startsWith('http')
              ? item.productId.imageUrl
              : `http://localhost:5000/${item.productId.imageUrl.replace(/^\/+/, '')}`
            : '/assets/default-product.png'
        }));
      },
      error: (err: HttpErrorResponse) => console.error('Failed to load wishlist:', err)
    });
  }

  removeItem(index: number) {
    const item = this.wishlistItems[index];
    this.wishlistService.removeFromWishlist(this.userEmail, item.productId._id).subscribe({
      next: () => {
        this.wishlistItems.splice(index, 1);
        this.loadWishlist();
      },
      error: (err: HttpErrorResponse) => console.error('Remove from wishlist failed:', err)
    });
  }
  routeToBuyerDashboard()
  {
      this.router.navigate(['/buyer-dashboard']);
  }
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('default-product.png')) {
      img.src = '/assets/default-product.png';
    }
  }
}