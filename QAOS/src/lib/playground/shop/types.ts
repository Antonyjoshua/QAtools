export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  /** The "actual" price charged at checkout. */
  price: number;
  /** The price shown in the catalog/detail page — equals `price` except for one deliberately mismatched SKU (BUG-012). */
  listPrice: number;
  rating: number;
  stock: number;
  description: string;
  emoji: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface Coupon {
  code: string;
  percentOff: number;
  expiresAt: string;
  minSubtotal?: number;
}

export type OrderStatus = "Placed" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  displayId: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  addressId: string;
  status: OrderStatus;
  createdAt: string;
}
