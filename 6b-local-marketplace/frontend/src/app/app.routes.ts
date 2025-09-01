import { WishlistComponent } from './buyer-dashboard/wishlist/wishlist.component';
import { CartComponent } from './buyer-dashboard/cart/cart.component';
import { OrdersComponent } from './buyer-dashboard/orders/orders.component';
import { LandingPage } from './landing-page/landing-page';
import { LoginSignup } from './login-signup/login-signup';
import { BuyerDashboard } from './buyer-dashboard/buyer-dashboard';
import { Routes } from '@angular/router';
import { VendorDashboard } from './vendor-dashboard/vendor-dashboard';
import { CheckoutComponent } from './buyer-dashboard/cart/checkout/checkout.component';
import { VendorOrdersComponent } from './vendor-dashboard/vendor-orders/vendor-orders.component';
import { RefundComponent } from './vendor-dashboard/refund/refund.component';
import { OrderTrackingComponent } from './buyer-dashboard/order-tracking/order-tracking.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';


export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginSignup },
  { path: 'buyer-dashboard', component: BuyerDashboard },
  { path : 'admin-dashboard', component: AdminDashboard},
  { path: 'vendor-dashboard', component: VendorDashboard },
  { path: 'wishlist', component: WishlistComponent },         
  { path: 'cart', component: CartComponent },                 
  { path: 'orders', component: OrdersComponent },
  {path: 'checkout', component: CheckoutComponent},
  {path: 'vendor-orders', component: VendorOrdersComponent},
  {path: 'refund', component: RefundComponent},
  {path: 'track-order', component: OrderTrackingComponent},
  {path: 'profile', component: ProfileComponent}
];
