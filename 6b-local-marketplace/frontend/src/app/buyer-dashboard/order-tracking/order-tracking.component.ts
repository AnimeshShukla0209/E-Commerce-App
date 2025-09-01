import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import {CommonModule} from '@angular/common'

declare var google: any;

interface DeliveryStep {
  title: string;
  time: string | null;
  status: 'completed' | 'active' | 'pending';
}

@Component({
  selector: 'app-tracking',
  imports:[CommonModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  order: any;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  statusCheckInterval: Subscription | null = null;

  // Random static locations as fallback
  randomStart = { lat: 28.6139, lng: 77.2090 }; // Delhi approx
  randomEnd = { lat: 28.7041, lng: 77.1025 };   // Nearby location in Delhi

  constructor(private router: Router, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav?.extras.state?.['order'];
  }

  ngOnInit(): void {
    if (!this.order) {
      this.router.navigate(['/orders']);
      return;
    }

    // Load Google Maps script if needed and then initialize map & tracking
    this.loadGoogleMapsScript().then(() => {
      this.initMapAndRoute();
    });

    // Poll order status every 10 sec for live update
    this.statusCheckInterval = interval(10000).subscribe(() => {
      this.refreshOrderStatus();
    });
  }

  ngOnDestroy(): void {
    this.statusCheckInterval?.unsubscribe();
  }

  async loadGoogleMapsScript(): Promise<void> {
    if ((window as any).google && (window as any).google.maps) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD-UlFlorECxdEF6bqmE3DFZ_FaU71E898`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  initMapAndRoute() {
    // Use actual vendor and shipping addresses if available, else random locations
    const start = this.order.vendorAddress || this.randomStart;
    const end = this.order.shippingAddress || this.randomEnd;

    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 13,
      center: start
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });

    this.calculateAndDisplayRoute(start, end);
  }

  calculateAndDisplayRoute(start: { lat: number; lng: number }, end: { lat: number; lng: number }) {
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: string) => {
      if (status === 'OK') {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  }

  refreshOrderStatus() {
    this.http.get<any>(`http://localhost:5000/api/track-order/${this.order._id}`).subscribe({
      next: (updatedOrder) => {
        if (updatedOrder && updatedOrder.deliveryStatus !== this.order.deliveryStatus) {
          this.order.deliveryStatus = updatedOrder.deliveryStatus;
        }
      },
      error: (err) => {
        console.error('Failed to fetch order status', err);
      }
    });
  }

  getDeliverySteps(): DeliveryStep[] {
  // If order cancelled, show only "Order Confirmed" -> "Cancelled"
  if (this.order.deliveryStatus === 'cancelled' || this.order.status === 'cancelled') {
    return [
      { title: 'Order Confirmed', time: this.order.confirmedAt || null, status: 'completed' },
      { title: 'Cancelled', time: this.order.cancelledAt || null, status: 'completed' }
    ];
  }

  // Normal flow for other statuses
  return [
    { title: 'Order Confirmed', time: this.order.confirmedAt || null, status: 'completed' },
    { title: 'Order Prepared', time: this.order.preparedAt || null, status: 'completed' },
    {
      title: 'Out for Delivery',
      time: this.order.outForDeliveryAt || null,
      status: this.order.deliveryStatus === 'delivered' 
        ? 'completed' 
        : this.order.deliveryStatus === 'out_for_delivery' 
          ? 'active' 
          : 'pending'
    },
    { 
      title: 'Delivered', 
      time: this.order.deliveredAt || null, 
      status: this.order.deliveryStatus === 'delivered' ? 'completed' : 'pending' 
    }
  ];
}

  goBack(): void {
  this.router.navigate(['/orders']);
}

}
