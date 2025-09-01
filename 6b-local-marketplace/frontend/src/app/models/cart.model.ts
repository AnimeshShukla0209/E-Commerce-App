import { Product } from './product.model';

export interface CartItem {
  _id: string;
  userEmail: string;
  productId: Product;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface AddToCartRequest {
  userEmail: string;
  productId: string;
  quantity?: number;
}

export interface UpdateCartQuantityRequest {
  userEmail: string;
  productId: string;
  quantity: number;
}