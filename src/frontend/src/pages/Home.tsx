import { Bell, Search, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import ChatBot from "../components/ChatBot";
import { useApp } from "../contexts/AppContext";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  size: string;
  isPacked: boolean;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  brand?: string;
  mrp?: string;
}
interface Category {
  id: string;
  name: string;
  emoji: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "dal", name: "Dal", emoji: "🫘" },
  { id: "masale", name: "Masale", emoji: "🌶️" },
  { id: "meva", name: "Meva", emoji: "🥜" },
  { id: "rice", name: "Rice", emoji: "🍚" },
  { id: "pooja", name: "Pooja Items", emoji: "🪔" },
  { id: "atta", name: "Atta & Flour", emoji: "🌾" },
  { id: "oil", name: "Oil & Ghee", emoji: "🫙" },
  { id: "sugar", name: "Sugar & Salt", emoji: "🧂" },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Moong Dal",
    categoryId: "dal",
    description: "Premium quality moong dal",
    size: "500g",
    isPacked: true,
    price: "65",
    imageUrl:
      "https://images.unsplash.com/photo-1612200655498-5e8b8b9c6b2a?w=300",
    isAvailable: true,
    mrp: "70",
  },
  {
    id: "p2",
    name: "Chana Dal",
    categoryId: "dal",
    description: "Pure chana dal",
    size: "500g",
    isPacked: true,
    price: "58",
    imageUrl:
      "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300",
    isAvailable: true,
  },
  {
    id: "p3",
    name: "Haldi Powder",
    categoryId: "masale",
    description: "Pure turmeric powder",
    size: "100g",
    isPacked: true,
    price: "35",
    imageUrl:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300",
    isAvailable: true,
  },
  {
    id: "p4",
    name: "Red Chilli Powder",
    categoryId: "masale",
    description: "Kashmiri red chilli powder",
    size: "100g",
    isPacked: true,
    price: "45",
    imageUrl:
      "https://images.unsplash.com/photo-1583474810996-9f7d0e12ca87?w=300",
    isAvailable: true,
  },
  {
    id: "p5",
    name: "Kaju",
    categoryId: "meva",
    description: "Premium cashew nuts",
    size: "250g",
    isPacked: true,
    price: "280",
    imageUrl: "https://images.unsplash.com/photo-1563223771-375783ee91ad?w=300",
    isAvailable: true,
    mrp: "300",
  },
  {
    id: "p6",
    name: "Basmati Rice",
    categoryId: "rice",
    description: "Long grain basmati rice",
    size: "1kg",
    isPacked: true,
    price: "85",
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300",
    isAvailable: true,
  },
  {
    id: "p7",
    name: "Agarbatti",
    categoryId: "pooja",
    description: "Incense sticks - pack of 20",
    size: "Pack of 20",
    isPacked: true,
    price: "30",
    imageUrl: "https://images.unsplash.com/photo-1562887250-9a3e1a5b5e3f?w=300",
    isAvailable: true,
  },
  {
    id: "p8",
    name: "Aata",
    categoryId: "atta",
    description: "Chakki fresh whole wheat flour",
    size: "5kg",
    isPacked: true,
    price: "180",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
    isAvailable: true,
  },
  {
    id: "p9",
    name: "Sarson Ka Tel",
    categoryId: "oil",
    description: "Pure mustard oil",
    size: "1L",
    isPacked: true,
    price: "160",
    imageUrl:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300",
    isAvailable: true,
  },
  {
    id: "p10",
    name: "Sugar",
    categoryId: "sugar",
    description: "Pure white sugar",
    size: "1kg",
    isPacked: true,
    price: "42",
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300",
    isAvailable: true,
  },
];

export { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS };

export default function Home() {
  const navigate = useNavigate();
  const { cartCount } = useApp();
  const [search, setSearch] = useState("");
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [products] = useState<Product[]>(DEFAULT_PRODUCTS);
  const user = JSON.parse(localStorage.getItem("ncrt_user") || "{}");

  useEffect(() => {
    if (!localStorage.getItem("ncrt_seeded")) {
      localStorage.setItem("ncrt_products", JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem(
        "ncrt_categories",
        JSON.stringify(DEFAULT_CATEGORIES),
      );
      localStorage.setItem("ncrt_seeded", "1");
    }
  }, []);

  const filtered = search
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-green-600 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">
              NEW C.R. TRADERS
            </h1>
            <p className="text-green-100 text-xs">Mahavir Ganj, Aligarh</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="home.cart_button"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingCart className="text-white" size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <Bell className="text-white" size={20} />
          </div>
        </div>
        <p className="text-green-100 text-sm">
          Hello, {user.fullName?.split(" ")[0] || "Customer"} 👋
        </p>
      </div>

      {/* Search */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-xl shadow-md flex items-center px-4 py-3 gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            data-ocid="home.search_input"
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
      </div>

      {/* Search Results */}
      {search && (
        <div className="px-4 mt-3">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Search Results
          </h3>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400">No products found</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  data-ocid={`search.item.${p.id}`}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm cursor-pointer"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.size}</p>
                  </div>
                  <p className="text-green-700 font-bold text-sm">₹{p.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!search && (
        <>
          {/* Banner */}
          <div className="mx-4 mt-4 bg-gradient-to-r from-green-500 to-green-700 rounded-2xl p-4 text-white">
            <p className="font-bold text-base">Shuddh Quality, Sahi Daam</p>
            <p className="text-sm text-green-100 mt-0.5">
              Fresh groceries delivered in Aligarh
            </p>
            <button
              type="button"
              data-ocid="home.shop_now_button"
              onClick={() => navigate("/category/dal")}
              className="mt-2 bg-white text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full"
            >
              Shop Now
            </button>
          </div>

          {/* Categories */}
          <div className="px-4 mt-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">
              Categories
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  data-ocid={`home.category.${cat.id}.button`}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex flex-col items-center bg-white rounded-2xl py-3 px-1 shadow-sm hover:shadow-md transition"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs text-gray-700 mt-1 text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="px-4 mt-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">
              Popular Products
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {products
                .filter((p) => p.isAvailable)
                .slice(0, 6)
                .map((p) => (
                  <div
                    key={p.id}
                    data-ocid={`home.product.${p.id}.card`}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300";
                      }}
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">{p.size}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-green-700 font-bold text-sm">
                            ₹{p.price}
                          </span>
                          {p.mrp && (
                            <span className="text-gray-400 text-xs line-through ml-1">
                              ₹{p.mrp}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          data-ocid={`home.product.${p.id}.add_button`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${p.id}`);
                          }}
                          className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Shop Info */}
          <div className="mx-4 mt-5 mb-4 bg-green-50 rounded-2xl p-4">
            <p className="text-xs text-gray-600 font-semibold mb-1">
              📍 NEW C.R. TRADERS
            </p>
            <p className="text-xs text-gray-500">
              Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas
            </p>
            <p className="text-xs text-gray-500">
              Aligarh - 202001, Uttar Pradesh
            </p>
            <p className="text-xs text-gray-500 mt-1">📞 9358251328</p>
          </div>
        </>
      )}

      <ChatBot />
      <BottomNav />
    </div>
  );
}
