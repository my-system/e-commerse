"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';

export interface UserPreferences {
  viewedProducts: string[];
  searchHistory: string[];
  clickedCategories: string[];
  wishlistItems: string[];
  cartItems: string[];
  favoriteCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  lastVisit: string;
  sessionCount: number;
}

export interface UserPreferencesState {
  preferences: UserPreferences;
  recommendations: Product[];
  isLoading: boolean;
}

export type UserPreferencesAction =
  | { type: 'VIEW_PRODUCT'; payload: string }
  | { type: 'SEARCH_PRODUCT'; payload: string }
  | { type: 'CLICK_CATEGORY'; payload: string }
  | { type: 'ADD_WISHLIST'; payload: string }
  | { type: 'REMOVE_WISHLIST'; payload: string }
  | { type: 'ADD_CART'; payload: string }
  | { type: 'REMOVE_CART'; payload: string }
  | { type: 'SET_RECOMMENDATIONS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_PREFERENCES'; payload: UserPreferences }
  | { type: 'RESET_PREFERENCES' };

const initialState: UserPreferencesState = {
  preferences: {
    viewedProducts: [],
    searchHistory: [],
    clickedCategories: [],
    wishlistItems: [],
    cartItems: [],
    favoriteCategories: [],
    priceRange: { min: 0, max: 10000000 },
    lastVisit: new Date().toISOString(),
    sessionCount: 1,
  },
  recommendations: [],
  isLoading: false,
};

function userPreferencesReducer(state: UserPreferencesState, action: UserPreferencesAction): UserPreferencesState {
  switch (action.type) {
    case 'VIEW_PRODUCT':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          viewedProducts: [action.payload, ...state.preferences.viewedProducts.filter(p => p !== action.payload)].slice(0, 50),
        },
      };

    case 'SEARCH_PRODUCT':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          searchHistory: [action.payload, ...state.preferences.searchHistory.filter(s => s !== action.payload)].slice(0, 20),
        },
      };

    case 'CLICK_CATEGORY':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          clickedCategories: [action.payload, ...state.preferences.clickedCategories.filter(c => c !== action.payload)].slice(0, 10),
        },
      };

    case 'ADD_WISHLIST':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          wishlistItems: [...new Set([...state.preferences.wishlistItems, action.payload])],
        },
      };

    case 'REMOVE_WISHLIST':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          wishlistItems: state.preferences.wishlistItems.filter(item => item !== action.payload),
        },
      };

    case 'ADD_CART':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          cartItems: [...new Set([...state.preferences.cartItems, action.payload])],
        },
      };

    case 'REMOVE_CART':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          cartItems: state.preferences.cartItems.filter(item => item !== action.payload),
        },
      };

    case 'SET_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOAD_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...action.payload,
          lastVisit: new Date().toISOString(),
          sessionCount: action.payload.sessionCount + 1,
        },
      };

    case 'RESET_PREFERENCES':
      return {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          lastVisit: new Date().toISOString(),
        },
      };

    default:
      return state;
  }
}

const UserPreferencesContext = createContext<{
  state: UserPreferencesState;
  dispatch: React.Dispatch<UserPreferencesAction>;
  trackProductView: (productId: string) => void;
  trackSearch: (query: string) => void;
  trackCategoryClick: (category: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  getRecommendations: () => void;
  clearPreferences: () => void;
} | null>(null);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userPreferencesReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({ type: 'LOAD_PREFERENCES', payload: preferences });
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  const trackProductView = (productId: string) => {
    dispatch({ type: 'VIEW_PRODUCT', payload: productId });
  };

  const trackSearch = (query: string) => {
    if (query.trim()) {
      dispatch({ type: 'SEARCH_PRODUCT', payload: query.trim() });
    }
  };

  const trackCategoryClick = (category: string) => {
    dispatch({ type: 'CLICK_CATEGORY', payload: category });
  };

  const addToWishlist = (productId: string) => {
    dispatch({ type: 'ADD_WISHLIST', payload: productId });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_WISHLIST', payload: productId });
  };

  const addToCart = (productId: string) => {
    dispatch({ type: 'ADD_CART', payload: productId });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_CART', payload: productId });
  };

  const getRecommendations = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // This will be implemented with the recommendation engine
    setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
  };

  const clearPreferences = () => {
    dispatch({ type: 'RESET_PREFERENCES' });
    localStorage.removeItem('userPreferences');
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        state,
        dispatch,
        trackProductView,
        trackSearch,
        trackCategoryClick,
        addToWishlist,
        removeFromWishlist,
        addToCart,
        removeFromCart,
        getRecommendations,
        clearPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}
