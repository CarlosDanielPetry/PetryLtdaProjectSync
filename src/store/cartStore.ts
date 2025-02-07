import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find((item) => item.product.id === product.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
    
    set((state) => ({
      total: state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    }));
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
      total: state.items
        .filter((item) => item.product.id !== productId)
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
      total: state.items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }));
  },
  clearCart: () => set({ items: [], total: 0 }),
}));