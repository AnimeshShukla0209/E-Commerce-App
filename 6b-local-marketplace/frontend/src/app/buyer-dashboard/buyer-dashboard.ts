import { Component, OnInit, ElementRef, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Category, CategoryService } from '../services/categories.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';
import { AddToCartRequest } from '../models/cart.model';
import { AddToWishlistRequest } from '../models/wishlist.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  templateUrl: './buyer-dashboard.html',
  styleUrls: ['./buyer-dashboard.css'],
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet]
})
export class BuyerDashboard implements OnInit {
  userName = '';
  userRole = '';
  searchQuery = '';
  searchFilter = 'name';
  featuredProducts: any[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  isDropdownOpen = false;
  isCategoryDropdownOpen = false;
  wishlistIds: string[] = [];

  constructor(
    private elementRef: ElementRef,
    private http: HttpClient,
    private categoryService: CategoryService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.userName = user.name || 'Guest';
        this.userRole = user.role || 'buyer';
      } else {
        console.warn('No user data found in localStorage');
        this.router.navigate(['/login']);
      }
    }

    this.loadCategories();
    this.loadWishlistIds();
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.loadProducts();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Failed to load categories:', err)
    });
  }

  loadWishlistIds() {
    if (!isPlatformBrowser(this.platformId)) return;
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const user = JSON.parse(userData);
    const email = user.email;
    if (!email) return;

    this.wishlistService.getWishlist(email).subscribe({
      next: items => {
        this.wishlistIds = items.map(i => i.productId?._id as string);
        this.markProductsInWishlist();
      },
      error: err => console.error('Failed to load wishlist IDs:', err)
    });
  }

  searchProducts() {
    if (!this.searchQuery.trim()) {
      this.loadProducts();
      return;
    }
    const params: any = {};
    params[this.searchFilter] = this.searchQuery.trim();
    const query = new URLSearchParams(params).toString();
    const url = `http://localhost:5000/api/products/search?${query}`;
    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.featuredProducts = data.map(p => this.normalizeProduct(p));
        this.markProductsInWishlist();
      },
      error: err => console.error('Search failed:', err)
    });
  }

  loadProducts() {
    let url = 'http://localhost:5000/api/products';
    if (this.selectedCategory) {
      url += `/category/${encodeURIComponent(this.selectedCategory)}`;
    } else {
      url += `/all`;
    }

    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.featuredProducts = (data || []).map(p => this.normalizeProduct(p));
        this.markProductsInWishlist();
      },
      error: err => console.error('Failed to fetch products:', err)
    });
  }

  normalizeProduct(p: any) {
    const product = { ...p };
    product.imageUrl = product.imageUrl
      ? product.imageUrl.startsWith('http')
        ? product.imageUrl
        : `http://localhost:5000/${product.imageUrl.replace(/^\/+/, '')}`
      : '/assets/default-product.png';
    product.price = Number(product.price) || 0;
    return product;
  }

  markProductsInWishlist() {
    if (!this.featuredProducts || !this.wishlistIds) return;
    this.featuredProducts.forEach(p => {
      p.isInWishlist = this.wishlistIds.includes((p._id ?? p.id) as string);
    });
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.isCategoryDropdownOpen = false;
        this.isDropdownOpen = false;
      }
    }
  }

  toggleDropdown() { this.isDropdownOpen = !this.isDropdownOpen; }
  toggleCategoryDropdown() { this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen; }
  goToCategoryProducts(categoryName: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryName },
      queryParamsHandling: 'merge'
    });
  }

  addToCart(product: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(userData);
    const userEmail = user.email;
    if (!userEmail) {
      alert('Invalid user session. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
    if (!product || !product._id) {
      alert('Error: Invalid product selected. Please try a different product.');
      return;
    }

    const request: AddToCartRequest = { userEmail, productId: product._id, quantity: 1 };
    this.cartService.addToCart(request).subscribe({
      next: () => alert(`${product.name} added to cart!`),
      error: err => {
        console.error('Add to cart failed:', err);
        const msg = err.error?.message || 'Please try again.';
        alert(`Failed to add to cart. ${msg}`);
      }
    });
  }

  addToWishlist(product: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please log in to add items to your wishlist.');
      this.router.navigate(['/login']);
      return;
    }
    const user = JSON.parse(userData);
    const userEmail = user.email;
    if (!userEmail) {
      alert('Invalid user session. Please log in again.');
      this.router.navigate(['/login']);
      return;
    }
    if (!product || !product._id) {
      alert('Error: Invalid product selected. Please try a different product.');
      return;
    }

    const id = product._id;
    const inWishlist = this.wishlistIds.includes(id);

    if (inWishlist) {
      this.wishlistService.removeFromWishlist(userEmail, id).subscribe({
        next: () => {
          this.wishlistIds = this.wishlistIds.filter(i => i !== id);
          product.isInWishlist = false;
          alert(`${product.name} removed from wishlist!`);
        },
        error: err => {
          console.error('Remove from wishlist failed:', err);
          alert('Could not remove from wishlist.');
        }
      });
    } else {
      const request: AddToWishlistRequest = { userEmail, productId: id };
      this.wishlistService.addToWishlist(request).subscribe({
        next: () => {
          this.wishlistIds.push(id);
          product.isInWishlist = true;
          alert(`${product.name} added to wishlist!`);
        },
        error: err => {
          console.error('Add to wishlist failed:', err);
          const msg = err.error?.message || 'Please try again.';
          alert(`Failed to add to wishlist. ${msg}`);
        }
      });
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
      alert('You have been logged out.');
      window.location.href = '/login';
    }
  }

  goToOrders() { window.location.href = '/orders'; }
  goToSettings() { window.location.href = '/settings'; }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src.endsWith('default-product.png')) {
      img.src = '/assets/default-product.png';
    }
  }
}