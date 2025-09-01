import { Product } from './product.model';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cod' | 'cancelled' | 'refunded' | 'refund_pending';
export type PaymentMethod = 'online' | 'cod';
export type DeliveryStatus = 'pending' | 'shipping' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type OrderStatus = 'active' | 'cancelled';
export interface Order {
  _id: string;
  buyerEmail: string;
  productId: Product;
  quantity: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId: string | null;
  deliveryStatus: DeliveryStatus;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  refundProcessed?: boolean;
}

export interface CreateOrderRequest {
  buyerEmail: string;
  productId: string;
  quantity: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentUpdateRequest {
  paymentId: string;
  paymentStatus: Exclude<PaymentStatus, 'pending' | 'cod'>;
}

export interface DeliveryUpdateRequest {
  deliveryStatus: DeliveryStatus;
}