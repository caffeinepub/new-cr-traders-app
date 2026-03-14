import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, setLastOrder } = useApp();
  const user = JSON.parse(localStorage.getItem("ncrt_user") || "{}");
  const [loading, setLoading] = useState(false);

  const isAligarh = (user.city || "").toLowerCase().includes("aligarh");

  const placeOrder = async () => {
    if (!isAligarh) {
      toast.error("Delivery not available outside Aligarh");
      return;
    }
    setLoading(true);
    try {
      const order = {
        id: Date.now().toString(),
        customerId: user.id || "guest",
        customerName: user.fullName || "",
        customerPhone: user.phone || "",
        deliveryAddress: `${user.address}, ${user.city}, ${user.state}`,
        items: JSON.stringify(cart),
        totalAmount: cartTotal.toFixed(2),
        status: "confirmed",
        createdAt: Date.now(),
      };
      const orders = JSON.parse(localStorage.getItem("ncrt_orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("ncrt_orders", JSON.stringify(orders));

      const itemsText = cart.map((i) => `${i.name} x${i.quantity}`).join(", ");
      const waText = encodeURIComponent(
        `🛒 *New Order from NEW C.R. TRADERS App*\n\n👤 Customer: ${user.fullName}\n📞 Phone: ${user.phone}\n📍 Address: ${order.deliveryAddress}\n\n📦 Items: ${itemsText}\n\n💰 Total: ₹${cartTotal.toFixed(2)}\n\n#OrderID: ${order.id}`,
      );
      window.open(`https://wa.me/919358251328?text=${waText}`, "_blank");

      setLastOrder(cart);
      clearCart();
      navigate("/order-success");
    } catch {
      toast.error("Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="pb-8">
      <div className="bg-green-600 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="checkout.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">Checkout</h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Delivery Notice */}
        {!isAligarh && (
          <div
            data-ocid="checkout.unavailable_banner"
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <p className="text-red-700 font-semibold text-sm">
              Currently Unavailable
            </p>
            <p className="text-red-600 text-xs mt-1">
              We only deliver in Aligarh, UP. Please update your address in
              Settings.
            </p>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-sm text-gray-700 mb-2">
            📍 Delivery Address
          </p>
          <p className="text-sm text-gray-600">{user.fullName}</p>
          <p className="text-sm text-gray-500">{user.address}</p>
          <p className="text-sm text-gray-500">
            {user.city}, {user.state}
          </p>
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="font-semibold text-sm text-gray-700 mb-3">
            Order Summary
          </p>
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm py-1"
            >
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ₹{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-green-700">
            Order confirmation will be sent via WhatsApp to 9358251328
          </p>
        </div>

        <button
          type="button"
          data-ocid="checkout.place_order_button"
          onClick={placeOrder}
          disabled={loading || !isAligarh}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
