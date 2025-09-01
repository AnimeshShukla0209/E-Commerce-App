import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet,Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  email: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.email = JSON.parse(localStorage.getItem('user') || '{}').email;
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<any[]>(`http://localhost:5000/api/orders/buyer/${this.email}`).subscribe({
      next: (res) => this.orders = res,
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  cancelOrder(orderId: string): void {
  if (confirm('Are you sure you want to cancel this order?')) {
    this.http.put(`http://localhost:5000/api/orders/cancel/${orderId}`, {}).subscribe({
      next: (res: any) => {
        alert(res.message); // This will now be correct based on backend
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Error canceling order', err);
        alert(err.error?.error || 'Failed to cancel order');
      }
    });
  }
}
  trackOrder(order: any) {
  // Navigate to tracking page and pass data via state
  this.router.navigate(['/track-order'], {
    state: { order }
  });
}


}