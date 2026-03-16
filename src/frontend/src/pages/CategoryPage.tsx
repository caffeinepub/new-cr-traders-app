import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import ChatBot from "../components/ChatBot";
import { useApp } from "../contexts/AppContext";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useNavigate, useParams } from "../lib/router";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const category = CATEGORIES.find((c) => c.id === id);
  const categoryProducts = PRODUCTS.filter(
    (p) => p.categoryId === id && p.isAvailable,
  );

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-green-700 px-4 pt-10 pb-4 flex items-center gap-3">
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
          categoryProducts.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              data-ocid={`category.item.${idx + 1}`}
              onClick={() => navigate(`/product/${p.id}`)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden text-left hover:shadow-md transition-shadow"
            >
              <div className="relative">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      const parent = (e.target as HTMLImageElement)
                        .parentElement;
                      if (parent) {
                        const ph = document.createElement("div");
                        ph.className =
                          "w-full h-32 bg-gray-100 flex items-center justify-center text-4xl";
                        ph.textContent = category?.emoji ?? p.name.charAt(0);
                        parent.insertBefore(ph, e.target as HTMLImageElement);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-4xl select-none">
                    {category?.emoji ?? p.name.charAt(0)}
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 text-white text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    p.isPacked ? "bg-blue-500" : "bg-orange-500"
                  }`}
                >
                  {p.isPacked ? "Packed" : "Unpacked"}
                </span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
                    {p.name}
                  </p>
                </div>
              </div>
              <div className="p-2">
                <p className="font-semibold text-xs text-gray-800 line-clamp-2 leading-tight">
                  {p.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{p.size}</p>
                {p.brand && (
                  <p className="text-blue-600 text-xs mt-0.5">{p.brand}</p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className="text-green-700 font-bold text-sm">₹{p.price}</p>
                  <button
                    type="button"
                    data-ocid={`category.item.${idx + 1}.button`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        productId: p.id,
                        name: p.name,
                        price: p.price,
                        imageUrl: p.imageUrl,
                        quantity: 1,
                        size: p.size,
                      });
                      toast.success(`${p.name} added to cart`);
                    }}
                    className="bg-green-600 text-white text-xs px-2 py-1 rounded-lg"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav />
      <ChatBot />
    </div>
  );
}
