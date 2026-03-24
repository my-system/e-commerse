"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface WishlistItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  isOpen: boolean;
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: Omit<WishlistItem, 'addedAt'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'TOGGLE_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

interface WishlistContextType {
  state: WishlistState;
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  toggleWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

interface WishlistProviderProps {
  children: ReactNode;
}

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      const newItem: WishlistItem = {
        ...action.payload,
        addedAt: new Date().toISOString(),
      };
      
      const updatedItems = [...state.items, newItem];
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.length,
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.productId !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.length,
      };
    }
    
    case 'CLEAR_WISHLIST': {
      localStorage.removeItem('wishlist');
      return {
        ...state,
        items: [],
        totalItems: 0,
      };
    }
    
    case 'TOGGLE_WISHLIST': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }
    
    case 'LOAD_WISHLIST': {
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
      };
    }
    
    default:
      return state;
  }
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    totalItems: 0,
    isOpen: false,
  });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      localStorage.removeItem('wishlist');
    }
  }, []);

  const addItem = (item: Omit<WishlistItem, 'addedAt'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const toggleWishlist = () => {
    dispatch({ type: 'TOGGLE_WISHLIST' });
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  };

  const value: WishlistContextType = {
    state,
    addItem,
    removeItem,
    clearWishlist,
    toggleWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
