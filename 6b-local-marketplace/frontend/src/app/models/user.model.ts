export interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'buyer' | 'vendor' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser extends User {
  password?: string; // Only for login/registration
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
  mobile: string;
  role?: 'buyer' | 'vendor' | 'admin';
}