import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { lastOrder } = useApp();

  return (
    <div className="min-h-screen bg-green-600 flex flex-col items-center justify-center px-6 pb-20">
      <div data-ocid="order_success.success_state" className="text-center">
        <div className="bg-white rounded-full p-6 w-28 h-28 flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <CheckCircle size={60} className="text-green-600" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-green-100 text-base">Your order is confirmed</p>
        <p className="text-green-200 text-sm mt-1">
          We will deliver it to your address soon
        </p>
      </div>

      {lastOrder && lastOrder.length > 0 && (
        <div className="w-full max-w-sm bg-white/20 backdrop-blur rounded-2xl p-4 mt-8">
          <p className="text-white font-semibold text-sm mb-2">Order Summary</p>
          {lastOrder.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm text-white/90 py-1"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-white/20 backdrop-blur rounded-2xl p-4 w-full max-w-sm">
        <p className="text-white text-xs text-center">
          Order confirmation sent via WhatsApp to our team at 9358251328
        </p>
      </div>

      <button
        type="button"
        data-ocid="order_success.continue_button"
        onClick={() => navigate("/home")}
        className="mt-8 bg-white text-green-700 font-bold px-10 py-4 rounded-2xl text-base shadow-lg"
      >
        Continue Shopping
      </button>
      <BottomNav />
    </div>
  );
}
