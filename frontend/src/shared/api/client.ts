/// <reference types="vite/client" />
import { Category, Product, Order, OrderStatus, Review } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './mockData';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Local storage keys for persistent mock testing
const STORAGE_KEYS = {
  CATEGORIES: 'pos_categories_v1',
  PRODUCTS: 'pos_products_v1',
  ORDERS: 'pos_orders_v1',
  REVIEWS: 'pos_reviews_v1',
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // Products
  async getProducts(): Promise<Product[]> {
    return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async updateProductAvailability(id: string, isAvailable: boolean): Promise<Product | null> {
    const products = await this.getProducts();
    const target = products.find((p) => p.id === id);
    if (target) {
      target.isAvailable = isAvailable;
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return target;
    }
    return null;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orders = await this.getOrders();
    const newId = `ord-${Date.now()}`;
    const orderNumber = `TH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const orders = await this.getOrders();
    const target = orders.find((o) => o.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return target;
    }
    return null;
  },

  // Reviews
  async getReviews(orderId?: string): Promise<Review[]> {
    const all = getFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, [
      {
        id: 'rev-1',
        orderId: 'ord-1001',
        userName: 'คุณสมชาย',
        rating: 5,
        comment: 'ยำปลาดุกฟูกรอบมาก น้ำยำเปรี้ยวหวานกลมกล่อม ไม่อมน้ำมันเลย ประทับใจมากครับ!',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ]);
    if (orderId) {
      return all.filter((r) => r.orderId === orderId);
    }
    return all;
  },

  async submitReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const all = await this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newReview);
    saveToStorage(STORAGE_KEYS.REVIEWS, all);
    return newReview;
  },
};
