import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import ChatBot from "../components/ChatBot";
import { useApp } from "../contexts/AppContext";
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./Home";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const categories = JSON.parse(
    localStorage.getItem("ncrt_categories") ||
      JSON.stringify(DEFAULT_CATEGORIES),
  );
  const products = JSON.parse(
    localStorage.getItem("ncrt_products") || JSON.stringify(DEFAULT_PRODUCTS),
  );
  const category = categories.find((c: { id: string }) => c.id === id);
  const categoryProducts = products.filter(
    (p: { categoryId: string; isAvailable: boolean }) =>
      p.categoryId === id && p.isAvailable,
  );

  return (
    <div className="pb-20">
      <div className="bg-green-600 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="category.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">
          {category?.emoji} {category?.name || "Products"}
        </h1>
      </div>
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {categoryProducts.length === 0 ? (
          <div
            data-ocid="category.empty_state"
            className="col-span-2 text-center py-12 text-gray-400"
          >
            <p className="text-4xl mb-2">📦</p>
            <p className="text-sm">No products in this category</p>
          </div>
        ) : (
          categoryProducts.map(
            (p: {
              id: string;
              imageUrl: string;
              name: string;
              size: string;
              price: string;
              mrp?: string;
              isPacked: boolean;
            }) => (
              <div
                key={p.id}
                data-ocid={`category.product.${p.id}.card`}
                onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer"
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
                  <p className="text-xs text-gray-500">
                    {p.size} · {p.isPacked ? "Packed" : "Unpacked"}
                  </p>
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
                      data-ocid={`category.product.${p.id}.add_button`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          productId: p.id,
                          name: p.name,
                          price: Number.parseFloat(p.price),
                          imageUrl: p.imageUrl,
                          quantity: 1,
                          size: p.size,
                        });
                        toast.success(`${p.name} added to cart`);
                      }}
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ),
          )
        )}
      </div>
      <ChatBot />
      <BottomNav />
    </div>
  );
}
