import { Home, Package, RefreshCw, Settings, ShoppingCart } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useLocation, useNavigate } from "../lib/router";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/cart", icon: ShoppingCart, label: "Cart" },
  { path: "/orders", icon: Package, label: "Orders" },
  { path: "/orders", icon: RefreshCw, label: "Buy Again" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useApp();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex shadow-lg z-40">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            type="button"
            key={tab.label}
            data-ocid={`nav.${tab.label.toLowerCase().replace(" ", "_")}.button`}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition ${isActive ? "text-green-600" : "text-gray-400"}`}
          >
            <div className="relative">
              <Icon size={20} />
              {tab.label === "Cart" && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
