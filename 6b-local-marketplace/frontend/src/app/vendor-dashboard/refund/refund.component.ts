import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DecimalPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-refund',
  standalone: true,
  imports: [CommonModule, DecimalPipe, SlicePipe], // Added required imports
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {
  refundOrders: any[] = [];
  loading = false; // Changed from isLoading to loading
  errorMessage = ''; // Added errorMessage property

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRefundOrders();
  }

  loadRefundOrders(): void {
    this.loading = true;
    this.errorMessage = '';
    const vendorEmail = localStorage.getItem('email') || '';
    
    this.http.get<any[]>(`http://localhost:5000/api/refund/pending?email=${vendorEmail}`)
      .subscribe({
        next: (orders) => {
          this.refundOrders = orders;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load refund orders';
          this.loading = false;
          console.error(err);
        }
      });
  }

  processRefund(orderId: string): void {
    if (!confirm('Are you sure you want to process this refund?')) return;
    
    this.loading = true;
    this.http.put(`http://localhost:5000/api/refund/${orderId}/process`, {})
      .subscribe({
        next: () => {
          this.refundOrders = this.refundOrders.filter(o => o._id !== orderId);
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to process refund';
          this.loading = false;
          console.error(err);
        }
      });
  }
  getSafeImageUrl(url: string | undefined): string {
    if (!url) return 'assets/default-product.png';
    // Handle relative paths if needed
    if (url.startsWith('http')) return url;
    return `http://localhost:5000/${url.replace(/^\/+/, '')}`;
  }

  goBack(): void {
    this.router.navigate(['/vendor-dashboard']);
  }
}