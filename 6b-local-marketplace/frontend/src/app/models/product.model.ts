export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  email: string; // Vendor email
  area: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  area: string;
  imageUrl?: string;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
  _id: string;
}