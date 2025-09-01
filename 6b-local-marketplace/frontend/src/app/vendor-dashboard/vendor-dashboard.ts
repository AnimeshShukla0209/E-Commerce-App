import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryService } from '../services/categories.service';
import { RouterOutlet, Router, RouterModule} from '@angular/router';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';


@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vendor-dashboard.html',
  styleUrl: './vendor-dashboard.css'
})
export class VendorDashboard implements OnInit {
  constructor(private router: Router,private http: HttpClient, private categoryService: CategoryService) {}
  
  vendorName: string = '';
  vendorEmail: string = '';
  showProductModal = false;
  showEditModal = false;
  showProductList = false;
  vendorProducts: any[] = [];
  isDropdownOpen = false;
  searchQuery: string = '';
  searchFilter: string = 'name';
  categories: Category[] = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Groceries' },
    { id: '4', name: 'Books' },
    { id: '5', name: 'Home Decor' },
    { id: '6', name: 'Toys' },
    { id: '7', name: 'Beauty' }
  ];
  product = { name: '', price: 0, stock: 0, category: '', area: '', image: null as File | null };
  imagePreview: string | ArrayBuffer | null = null;
  editingProductId: string | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = window.localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        this.vendorName = user.name;
        this.vendorEmail = user.email;
      }
    }
    this.loadCategories();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((cats) => {
      this.categories = cats;
    });
  }

  onImageSelected(event: any, isEdit: boolean = false) {
    const file = event.target.files[0];
    if (file) {
      if (isEdit) {
        this.editProductData.image = file;
        const reader = new FileReader();
        reader.onload = () => this.editImagePreview = reader.result;
        reader.readAsDataURL(file);
      } else {
        this.product.image = file;
        const reader = new FileReader();
        reader.onload = () => this.imagePreview = reader.result;
        reader.readAsDataURL(file);
      }
    }
  }

  searchVendorProducts() {
    if (!this.searchQuery.trim()) {
      this.fetchVendorProducts();
      return;
    }
    const params: any = { email: this.vendorEmail };
    params[this.searchFilter] = this.searchQuery.trim();
    const query = new URLSearchParams(params).toString();
    const url = `http://localhost:5000/api/products/search?${query}`;
    this.http.get<any[]>(url).subscribe({
      next: data => {
        this.vendorProducts = data;
        this.showProductList = true;
      },
      error: err => console.error('Vendor search failed:', err)
    });
  }

  submitProduct() {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('category', this.product.category);
    formData.append('email', this.vendorEmail);
    formData.append('area', this.product.area);
    if (this.product.image) {
      formData.append('image', this.product.image);
    }
    this.http.post('http://localhost:5000/api/products/add', formData).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.resetForm();
        this.fetchVendorProducts();
      },
      error: err => console.error('Error:', err)
    });
  }

  resetForm() {
    this.showProductModal = false;
    this.product = { name: '', price: 0, stock: 0, category: '', area: '', image: null };
    this.imagePreview = null;
  }

  fetchVendorProducts() {
    this.http.get<any[]>(`http://localhost:5000/api/products/by-vendor/${this.vendorEmail}`).subscribe({
      next: data => {
        this.vendorProducts = data;
        this.showProductList = true;
      },
      error: err => console.error('Failed to load products:', err)
    });
  }

  editProductData: any = { name: '', price: 0, stock: 0, category: '', area: '', image: null, _id: '' };
  editImagePreview: string | ArrayBuffer | null = null;

  openEditModal(product: any) {
    this.editingProductId = product._id;
    this.editProductData = { ...product, image: null };
    this.editImagePreview = 'http://localhost:5000' + product.imageUrl;
    this.showEditModal = true;
  }

  submitEditedProduct() {
    if (!this.editingProductId) return;
    const formData = new FormData();
    formData.append('name', this.editProductData.name);
    formData.append('price', this.editProductData.price.toString());
    formData.append('stock', this.editProductData.stock.toString());
    formData.append('category', this.editProductData.category);
    formData.append('area', this.editProductData.area);
    if (this.editProductData.image) {
      formData.append('image', this.editProductData.image);
    }
    this.http.put(`http://localhost:5000/api/products/update/${this.editingProductId}`, formData).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.showEditModal = false;
        this.editingProductId = null;
        this.fetchVendorProducts();
      },
      error: err => console.error('Error updating product:', err)
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:5000/api/products/${productId}`).subscribe({
        next: () => {
          console.log('✅ Product deleted');
          this.fetchVendorProducts();
        },
        error: (err) => console.error('❌ Delete failed', err)
      });
    }
  }

  goToVendorOrders() {
  this.router.navigate(['/vendor-orders']);
  }
  goToRefundableOrders() {
    this.router.navigate(['/refund']);
  }
  isVendorOrdersActive() {
    return this.router.url === '/vendor-orders';
  }
  logout() {
    localStorage.clear();
    alert('You have been logged out.');
    window.location.href = '/login';
  }
}