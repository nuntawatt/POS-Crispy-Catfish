import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, SelectedOption } from '../../shared/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, options: SelectedOption[], notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotalSatang: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity, options, notes) => {
        // Compute unique option hash
        const optionIds = options.map((o) => o.id).sort().join('_');
        const cartItemId = `${product.id}-${optionIds}-${notes || ''}`;

        const optionsPriceSatang = options.reduce((sum, o) => sum + o.priceSatang, 0);
        const unitPriceSatang = product.priceSatang + optionsPriceSatang;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === cartItemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex]!;
            const newQty = existing.quantity + quantity;
            updated[existingIndex] = {
              ...existing,
              quantity: newQty,
              totalSatang: existing.unitPriceSatang * newQty,
            };
            return { items: updated };
          }

          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            quantity,
            selectedOptions: options,
            notes,
            unitPriceSatang,
            totalSatang: unitPriceSatang * quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === itemId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null;
                return {
                  ...item,
                  quantity: newQty,
                  totalSatang: item.unitPriceSatang * newQty,
                };
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: updated };
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotalSatang: () => {
        return get().items.reduce((sum, item) => sum + item.totalSatang, 0);
      },
    }),
    {
      name: 'pos_crispy_catfish_cart',
    }
  )
);
