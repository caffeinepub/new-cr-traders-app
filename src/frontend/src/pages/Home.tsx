import { Bell, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import ChatBot from "../components/ChatBot";
import { useApp } from "../contexts/AppContext";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useNavigate } from "../lib/router";

export const DEFAULT_CATEGORIES = CATEGORIES;
export const DEFAULT_PRODUCTS = PRODUCTS;

export default function Home() {
  const navigate = useNavigate();
  const { cartCount, t } = useApp();
  const [search, setSearch] = useState("");

  const popularProducts = PRODUCTS.filter((p) => p.isAvailable).slice(0, 8);

  const searchResults = search.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.isAvailable && p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-green-700 px-4 pt-10 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/assets/uploads/WhatsApp-Image-2026-03-15-at-3.53.33-PM-2.jpeg"
            alt="NCR Traders Logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              NEW C.R. TRADERS
            </p>
            <p className="text-green-200 text-xs">Mahavir Ganj, Aligarh</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" data-ocid="home.notification_button">
            <Bell className="text-white" size={20} />
          </button>
          <button
            type="button"
            data-ocid="home.cart_button"
            onClick={() => navigate("/cart")}
            className="relative"
          >
            <ShoppingCart className="text-white" size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 gap-2 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            data-ocid="home.search_input"
            type="text"
            placeholder={t("search_placeholder")}
            className="flex-1 text-sm outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {search.trim() && (
        <div className="px-4 mb-2">
          <p className="text-xs text-gray-500 mb-2">
            {searchResults.length} {t("results_for")} "{search}"
          </p>
          <div className="grid grid-cols-2 gap-3">
            {searchResults.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-xl shadow-sm overflow-hidden text-left"
              >
                <div className="relative">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-28 object-cover"
                    />
                  ) : (
                    <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-3xl select-none">
                      {CATEGORIES.find((c) => c.id === p.categoryId)?.emoji ??
                        p.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                      {p.name}
                    </p>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                    {p.name}
                  </p>
                  <p className="text-green-700 font-bold text-xs mt-1">
                    ₹{p.price}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {searchResults.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              {t("no_products")}
            </p>
          )}
        </div>
      )}

      {!search.trim() && (
        <>
          {/* Shop Banner */}
          <div className="mx-4 mt-2 rounded-2xl overflow-hidden relative h-40 shadow">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-15-at-3.44.21-PM-1.jpeg"
              alt="NEW C.R. TRADERS Shop"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
              <p className="text-white font-bold text-base">NEW C.R. TRADERS</p>
              <p className="text-gray-300 text-xs">
                Mahavir Ganj, Aligarh – 202001
              </p>
            </div>
          </div>

          {/* Pickup Notice */}
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <span className="text-lg">🏪</span>
            <div>
              <p className="text-amber-800 font-semibold text-xs">
                {t("pickup_only")}
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                {t("pickup_notice")}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 mt-4">
            <h2 className="font-bold text-gray-800 text-sm mb-3">
              {t("all_categories")}
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  data-ocid="home.category.button"
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="bg-white rounded-xl shadow-sm p-2 flex flex-col items-center gap-1 hover:bg-green-50 transition-colors"
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <p
                    className="text-gray-700 text-center leading-tight"
                    style={{ fontSize: "9px" }}
                  >
                    {cat.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Popular Products */}
          <div className="px-4 mt-5">
            <h2 className="font-bold text-gray-800 text-sm mb-3">
              {t("popular_products")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {popularProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl select-none">
                        {CATEGORIES.find((c) => c.id === p.categoryId)?.emoji ??
                          p.name.charAt(0)}
                      </div>
                    )}
                    <span
                      className={`absolute top-2 right-2 text-white text-xs px-1.5 py-0.5 rounded-full font-medium ${p.isPacked ? "bg-blue-500" : "bg-orange-500"}`}
                    >
                      {p.isPacked ? t("packed") : t("unpacked")}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                      <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                        {p.name}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.size}</p>
                    <p className="text-green-700 font-bold text-sm mt-1">
                      ₹{p.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mx-4 mt-6 mb-4 text-center">
            <p className="text-xs text-gray-400">
              GSTIN: 09BTFPK1482H1ZK | FSSAI: 22727411000024
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © {new Date().getFullYear()}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="text-gray-400"
                target="_blank"
                rel="noreferrer"
              >
                Built with ❤️ using caffeine.ai
              </a>
            </p>
          </div>
        </>
      )}

      <BottomNav />
      <ChatBot />
    </div>
  );
}
