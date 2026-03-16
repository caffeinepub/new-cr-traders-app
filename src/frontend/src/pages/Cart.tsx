import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";
import { useNavigate } from "../lib/router";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal, t } = useApp();

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      <div className="bg-green-700 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="cart.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">{t("my_cart")}</h1>
      </div>

      {/* Pickup Notice */}
      <div className="mx-4 mt-3 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2.5 flex items-start gap-2">
        <span className="text-base">🏪</span>
        <div>
          <p className="text-amber-800 font-semibold text-xs">
            {t("pickup_only")}
          </p>
          <p className="text-amber-700 text-xs mt-0.5">{t("pickup_cart")}</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div
          data-ocid="cart.empty_state"
          className="flex flex-col items-center justify-center py-24"
        >
          <span className="text-6xl">🛒</span>
          <p className="text-gray-500 mt-4 text-sm">{t("cart_empty")}</p>
          <button
            type="button"
            data-ocid="cart.primary_button"
            onClick={() => navigate("/home")}
            className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            {t("start_shopping")}
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 mt-4 space-y-3">
            {cart.map((item, idx) => (
              <div
                key={item.productId}
                data-ocid={`cart.item.${idx + 1}`}
                className="bg-white rounded-2xl shadow-sm p-3 flex gap-3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100";
                  }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size}</p>
                  <p className="text-green-700 font-bold text-sm mt-1">
                    ₹{item.price}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    type="button"
                    data-ocid={`cart.item.${idx + 1}.delete_button`}
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      type="button"
                      data-ocid={`cart.item.${idx + 1}.secondary_button`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="text-gray-600"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      data-ocid={`cart.item.${idx + 1}.primary_button`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="text-gray-600"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{t("subtotal")}</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{t("delivery")}</span>
              <span className="text-green-600 font-medium">
                {t("pickup_only")}
              </span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>{t("total")}</span>
              <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="fixed bottom-20 left-0 right-0 px-4">
            <button
              type="button"
              data-ocid="cart.submit_button"
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg"
            >
              {t("place_order")}
            </button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
