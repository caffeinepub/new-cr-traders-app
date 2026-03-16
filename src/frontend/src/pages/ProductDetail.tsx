import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";
import {
  CATEGORIES,
  PRODUCTS,
  UNPACKED_WEIGHTS,
  WEIGHT_MULTIPLIER,
} from "../data/products";
import { useNavigate, useParams } from "../lib/router";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("1kg");

  const product = PRODUCTS.find((p) => p.id === id);
  const category = product
    ? CATEGORIES.find((c) => c.id === product.categoryId)
    : null;

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-400">Product not found</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 text-green-600 text-sm"
        >
          Go Back
        </button>
      </div>
    );

  const calculatedPrice = product.isPacked
    ? product.price
    : Math.round(product.price * WEIGHT_MULTIPLIER[selectedWeight]);

  const displaySize = product.isPacked ? product.size : selectedWeight;

  const handleAddToCart = () => {
    addToCart({
      productId: `${product.id}-${displaySize}`,
      name: product.name,
      price: calculatedPrice,
      imageUrl: product.imageUrl,
      quantity: qty,
      size: displaySize,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <div className="relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-6xl select-none">
            {CATEGORIES.find((c) => c.id === product.categoryId)?.emoji ??
              product.name.charAt(0)}
          </div>
        )}
        <button
          type="button"
          data-ocid="product.back_button"
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 bg-white rounded-full p-2 shadow"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
      </div>

      <div className="px-4 py-4 bg-white mx-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              {category?.emoji} {category?.name}
            </p>
            <h1 className="text-lg font-bold text-gray-900 mt-0.5">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-blue-600 text-sm font-medium">
                {product.brand}
              </p>
            )}
          </div>
          <span
            className={`text-white text-xs px-2 py-1 rounded-full font-medium ${
              product.isPacked ? "bg-blue-500" : "bg-orange-500"
            }`}
          >
            {product.isPacked ? "Packed" : "Unpacked"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mt-2">{product.description}</p>

        {/* Weight Selector for Unpacked Items */}
        {!product.isPacked && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Select Weight:
            </p>
            <div className="flex flex-wrap gap-2">
              {UNPACKED_WEIGHTS.map((w) => (
                <button
                  key={w}
                  type="button"
                  data-ocid="product.toggle"
                  onClick={() => setSelectedWeight(w)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedWeight === w
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Base price: ₹{product.price}/kg
            </p>
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-green-700">
            ₹{calculatedPrice}
          </span>
          <span className="text-gray-500 text-sm">for {displaySize}</span>
        </div>

        {/* Pickup Notice */}
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center gap-2">
          <span>🏪</span>
          <p className="text-amber-800 text-xs">
            Pickup from shop — Mahavir Ganj, Aligarh
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="mt-4 flex items-center gap-4">
          <p className="text-sm font-semibold text-gray-700">Quantity:</p>
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-1">
            <button
              type="button"
              data-ocid="product.secondary_button"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus size={16} className="text-gray-700" />
            </button>
            <span className="font-bold text-gray-900 w-6 text-center">
              {qty}
            </span>
            <button
              type="button"
              data-ocid="product.primary_button"
              onClick={() => setQty(qty + 1)}
            >
              <Plus size={16} className="text-gray-700" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Total:{" "}
            <span className="font-bold text-green-700">
              ₹{calculatedPrice * qty}
            </span>
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button
          type="button"
          data-ocid="product.submit_button"
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
        >
          <ShoppingCart size={18} />
          Add to Cart — ₹{calculatedPrice * qty}
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
