import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, cartTotal } = useApp();

  return (
    <div className="pb-32">
      <div className="bg-green-600 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="cart.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">My Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div
          data-ocid="cart.empty_state"
          className="flex flex-col items-center justify-center py-24"
        >
          <span className="text-6xl">🛒</span>
          <p className="text-gray-500 mt-4 text-sm">Your cart is empty</p>
          <button
            type="button"
            data-ocid="cart.shop_button"
            onClick={() => navigate("/home")}
            className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Start Shopping
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
                      data-ocid={`cart.item.${idx + 1}.decrease_button`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-semibold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      data-ocid={`cart.item.${idx + 1}.increase_button`}
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold mb-4">
                <span>Total</span>
                <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                data-ocid="cart.checkout_button"
                onClick={() => navigate("/checkout")}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
      <BottomNav />
    </div>
  );
}
