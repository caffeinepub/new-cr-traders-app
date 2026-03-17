import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActorWithConfig } from "../config";

import { useApp } from "../contexts/AppContext";
import { useNavigate } from "../lib/router";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, setLastOrder } = useApp();
  const user = JSON.parse(localStorage.getItem("ncrt_user") || "{}");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderId = Date.now().toString();
      const order = {
        id: orderId,
        customerId: user.id || "guest",
        customerName: user.fullName || "",
        customerPhone: user.phone || "",
        deliveryAddress: `${user.address || ""}, ${user.city || "Aligarh"}, ${user.state || "UP"}`,
        items: JSON.stringify(cart),
        totalAmount: cartTotal.toFixed(2),
        status: "confirmed",
        createdAt: Date.now(),
      };

      // Save to localStorage
      const orders = JSON.parse(localStorage.getItem("ncrt_orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("ncrt_orders", JSON.stringify(orders));

      // Save to backend - create fresh actor to avoid initialization issues
      try {
        const actor = await createActorWithConfig();
        await actor.createOrderAnon(
          user.fullName || "Guest",
          user.phone || "",
          `${user.address || ""}, ${user.city || "Aligarh"}, ${user.state || "UP"}`,
          JSON.stringify(cart),
          cartTotal.toFixed(2),
        );
      } catch (e) {
        console.error("Backend order save failed", e);
        // Continue with WhatsApp even if backend fails
      }

      const itemsText = cart
        .map(
          (i) =>
            `${i.name} (${i.size}) x${i.quantity} = \u20b9${i.price * i.quantity}`,
        )
        .join("\n");
      const waText = encodeURIComponent(
        `\ud83d\uded2 *New Order - NEW C.R. TRADERS App*\n\n\ud83d\udc64 Customer: ${user.fullName || "Guest"}\n\ud83d\udcde Phone: ${user.phone || "N/A"}\n\ud83d\udccd Pickup from shop\n\n\ud83d\udce6 Items:\n${itemsText}\n\n\ud83d\udcb0 Total: \u20b9${cartTotal.toFixed(2)}\n\n#OrderID: ${orderId}\n\n\ud83c\udfea Customer will come to shop to collect`,
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
    <div className="pb-8 bg-gray-50 min-h-screen">
      <div className="bg-green-700 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="checkout.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">Checkout</h1>
      </div>

      <div className="mx-4 mt-4 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3">
        <p className="text-amber-800 font-bold text-sm">🏪 Pickup Only</p>
        <p className="text-amber-700 text-xs mt-1">
          Please come to our shop to collect your order.
        </p>
        <p className="text-amber-800 text-xs font-medium mt-1">
          Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh – 202001, UP
        </p>
        <p className="text-amber-700 text-xs mt-1">📞 9358251328</p>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-bold text-gray-800 text-sm mb-3">Order Summary</h2>
        <div className="space-y-2">
          {cart.map((item, idx) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span
                className="text-gray-700"
                data-ocid={`checkout.item.${idx + 1}`}
              >
                {item.name} ({item.size}) x{item.quantity}
              </span>
              <span className="font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-green-700">₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {user.fullName && (
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-2">
            Customer Details
          </h2>
          <p className="text-sm text-gray-700">{user.fullName}</p>
          <p className="text-xs text-gray-500">{user.phone}</p>
          {user.address && (
            <p className="text-xs text-gray-500">
              {user.address}, {user.city}
            </p>
          )}
        </div>
      )}

      <div className="px-4 mt-6">
        <button
          type="button"
          data-ocid="checkout.submit_button"
          onClick={placeOrder}
          disabled={loading || cart.length === 0}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? "Placing Order..."
            : "\ud83d\udcf1 Send Order via WhatsApp"}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Order will be sent to 9358251328
        </p>
      </div>
    </div>
  );
}
