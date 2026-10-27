export type Role = 'customer' | 'staff' | 'admin' | 'rider';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  nameTh: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  nameTh: string;
  priceSatang: number; // in Satang
  isAvailable: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  nameTh: string;
  description?: string;
  priceSatang: number; // in Satang (e.g. 12000 = 120 THB)
  imageUrl?: string;
  isAvailable: boolean;
  sortOrder: number;
  options?: ProductOption[];
  spicyLevel?: number; // 0: none, 1: mild, 2: medium, 3: spicy
  isSignature?: boolean;
}

export interface SelectedOption {
  id: string;
  name: string;
  nameTh: string;
  priceSatang: number;
}

export interface CartItem {
  id: string; // unique item id inside cart (e.g. productId + option hash)
  productId: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOption[];
  notes?: string;
  unitPriceSatang: number; // base price + options price
  totalSatang: number; // unitPriceSatang * quantity
}

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'picked_up'
  | 'canceled';

export type FulfillmentType = 'pickup' | 'delivery' | 'pos';

export type PaymentMethod = 'promptpay' | 'cash' | 'pos_cash';

export type PaymentStatus =
  | 'pending'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'expired'
  | 'canceled'
  | 'refund_pending'
  | 'refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productNameTh: string;
  unitPriceSatang: number;
  quantity: number;
  optionsSnapshot?: SelectedOption[];
  subtotalSatang: number;
}

export interface Order {
  id: string;
  userId?: string;
  guestTokenHash?: string;
  orderNumber: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  subtotalSatang: number;
  deliveryFeeSatang: number;
  totalSatang: number;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  tableNumber?: string;
  notes?: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  userId?: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

// Helpers for Satang (1 THB = 100 Satang)
export function satangToBaht(satang: number): number {
  return satang / 100;
}

export function bahtToSatang(baht: number): number {
  return Math.round(baht * 100);
}

export function formatSatang(satang: number): string {
  const baht = satangToBaht(satang);
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: satang % 100 === 0 ? 0 : 2,
  }).format(baht);
}
