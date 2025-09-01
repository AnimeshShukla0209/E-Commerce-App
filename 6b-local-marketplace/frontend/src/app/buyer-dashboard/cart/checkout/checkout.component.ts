import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  totalItems: number = 0;
  buyerEmail: string = '';
  paymentMethod: string = 'cod';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.buyerEmail = JSON.parse(localStorage.getItem('user') || '{}').email;
    this.loadCart();
  }

  loadCart() {
    this.http.get<any[]>(`http://localhost:5000/api/cart/${this.buyerEmail}`).subscribe({
      next: data => {
        this.cartItems = data;
        this.calculateSummary();
      },
      error: err => console.error('Failed to load cart:', err)
    });
  }

  calculateSummary(): void {
    this.totalItems = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.totalAmount = this.cartItems.reduce((total, item) => total + (item.productId.price * (item.quantity || 1)), 0);
  }

  placeOrder(): void {
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (this.paymentMethod === 'cod') {
      this.placeOrderBackend({ paymentStatus: 'cod', paymentMethod: 'cod' });
    } else if (this.paymentMethod === 'online') {
      const options = {
        key: 'rzp_test_IA0uooBydJIpp6',
        amount: this.totalAmount * 100,
        currency: 'INR',
        name: '6B Local Marketplace',
        description: 'Order Payment',
        handler: (response: any) => {
          this.placeOrderBackend({
            paymentStatus: 'paid',
            paymentMethod: 'online',
            paymentId: response.razorpay_payment_id
          });
        },
        prefill: { email: this.buyerEmail },
        theme: { color: '#3399cc' }
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        alert('Payment failed: ' + response.error.description);
      });
      rzp.open();
    }
  }

  placeOrderBackend(paymentInfo: { paymentStatus: string; paymentMethod: string; paymentId?: string | null }) {
    const orders = this.cartItems.map(item => ({
      buyerEmail: this.buyerEmail,
      productId: item.productId._id,
      quantity: item.quantity || 1,
      paymentMethod: paymentInfo.paymentMethod,
      paymentStatus: paymentInfo.paymentStatus,
      paymentId: paymentInfo.paymentId || null
    }));

    this.http.post('http://localhost:5000/api/orders', orders).subscribe({
      next: () => {
        alert('🎉 Order placed successfully!');
        this.router.navigate(['/buyer-dashboard/cart']);
      },
      error: (err) => {
        console.error('Order error:', err);
        alert('❌ Failed to place order');
      }
    });
  }
}