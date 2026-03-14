import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./Home";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [qty, setQty] = useState(1);

  const products = JSON.parse(
    localStorage.getItem("ncrt_products") || JSON.stringify(DEFAULT_PRODUCTS),
  );
  const categories = JSON.parse(
    localStorage.getItem("ncrt_categories") ||
      JSON.stringify(DEFAULT_CATEGORIES),
  );
  const product = products.find((p: { id: string }) => p.id === id);
  const category = product
    ? categories.find((c: { id: string }) => c.id === product.categoryId)
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

  return (
    <div className="pb-32">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400";
          }}
        />
        <button
          type="button"
          data-ocid="product.back_button"
          onClick={() => navigate(-1)}
          className="absolute top-10 left-4 bg-white rounded-full p-2 shadow"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
            {category && (
              <p className="text-xs text-green-600 mt-0.5">
                {category.emoji} {category.name}
              </p>
            )}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${product.isPacked ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
          >
            {product.isPacked ? "Packed" : "Unpacked"}
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-1">{product.size}</p>
        {product.brand && (
          <p className="text-xs text-gray-400 mt-0.5">Brand: {product.brand}</p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-green-700">
            ₹{product.price}
          </span>
          {product.mrp && product.mrp !== product.price && (
            <span className="text-gray-400 text-lg line-through">
              ₹{product.mrp}
            </span>
          )}
          {product.mrp && product.mrp !== product.price && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              Save ₹
              {(
                Number.parseFloat(product.mrp) -
                Number.parseFloat(product.price)
              ).toFixed(0)}
            </span>
          )}
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-600 mb-1">
            Description
          </p>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
            <button
              type="button"
              data-ocid="product.decrease_button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-green-700"
            >
              <Minus size={16} />
            </button>
            <span className="font-semibold w-6 text-center">{qty}</span>
            <button
              type="button"
              data-ocid="product.increase_button"
              onClick={() => setQty((q) => q + 1)}
              className="text-green-700"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            data-ocid="product.add_to_cart_button"
            onClick={() => {
              addToCart({
                productId: product.id,
                name: product.name,
                price: Number.parseFloat(product.price),
                imageUrl: product.imageUrl,
                quantity: qty,
                size: product.size,
              });
              toast.success(`${product.name} added to cart`);
              navigate("/cart");
            }}
            className="flex-1 ml-3 bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
