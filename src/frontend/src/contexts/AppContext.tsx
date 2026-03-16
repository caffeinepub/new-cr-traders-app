import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type LangKey,
  type TranslationKey,
  translations,
} from "../lib/translations";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  lastOrder: CartItem[] | null;
  setLastOrder: (items: CartItem[]) => void;
  language: LangKey;
  setLanguage: (lang: LangKey) => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | null>(null);
const VALID_LANGS: LangKey[] = [
  "English",
  "Hindi",
  "Marathi",
  "Bengali",
  "Punjabi",
  "Kannada",
  "Malayalam",
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ncrt_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [lastOrder, setLastOrder] = useState<CartItem[] | null>(null);
  const [language, setLanguageState] = useState<LangKey>(() => {
    const saved = localStorage.getItem("ncrt_lang") as LangKey;
    return VALID_LANGS.includes(saved) ? saved : "English";
  });

  useEffect(() => {
    localStorage.setItem("ncrt_cart", JSON.stringify(cart));
  }, [cart]);

  const setLanguage = (lang: LangKey) => {
    setLanguageState(lang);
    localStorage.setItem("ncrt_lang", lang);
  };

  const t = (key: TranslationKey): string => translations[language][key];

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing)
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== productId));

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: qty } : i,
      ),
    );
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        lastOrder,
        setLastOrder,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
