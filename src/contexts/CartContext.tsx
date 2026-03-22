"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductVariant } from '@/data/products';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    size?: ProductVariant;
    color?: ProductVariant;
  };
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => 
          item.productId === action.payload.productId &&
          item.variant?.size?.id === action.payload.variant?.size?.id &&
          item.variant?.color?.id === action.payload.variant?.color?.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...action.payload, addedAt: new Date().toISOString() }];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter(item => item.id !== id);
        const { totalItems, totalPrice } = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          totalItems,
          totalPrice,
        };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'SET_CART': {
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
      };
    }

    case 'LOAD_CART': {
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
      };
    }

    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (productId: string, variant?: { size?: ProductVariant; color?: ProductVariant }) => boolean;
  getItemQuantity: (productId: string, variant?: { size?: ProductVariant; color?: ProductVariant }) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('luxe-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('luxe-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    if (!state.isOpen) {
      dispatch({ type: 'TOGGLE_CART' });
    }
  };

  const closeCart = () => {
    if (state.isOpen) {
      dispatch({ type: 'TOGGLE_CART' });
    }
  };

  const isInCart = (productId: string, variant?: { size?: ProductVariant; color?: ProductVariant }) => {
    return state.items.some(
      item => 
        item.productId === productId &&
        item.variant?.size?.id === variant?.size?.id &&
        item.variant?.color?.id === variant?.color?.id
    );
  };

  const getItemQuantity = (productId: string, variant?: { size?: ProductVariant; color?: ProductVariant }) => {
    const item = state.items.find(
      item => 
        item.productId === productId &&
        item.variant?.size?.id === variant?.size?.id &&
        item.variant?.color?.id === variant?.color?.id
    );
    return item?.quantity || 0;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
