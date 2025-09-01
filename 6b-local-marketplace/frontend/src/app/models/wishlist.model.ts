import { Product } from './product.model';

export interface WishlistItem {
  _id: string;
  userEmail: string;
  productId: Product;
  createdAt?: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface AddToWishlistRequest {
  userEmail: string;
  productId: string;
}