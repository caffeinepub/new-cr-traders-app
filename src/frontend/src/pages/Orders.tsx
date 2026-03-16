import { ArrowLeft, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";
import { useNavigate } from "../lib/router";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
}
interface Order {
  id: string;
  customerName: string;
  deliveryAddress: string;
  items: string;
  totalAmount: string;
  status: string;
  createdAt: number;
}

export default function Orders() {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const orders: Order[] = JSON.parse(
    localStorage.getItem("ncrt_orders") || "[]",
  );
  const user = JSON.parse(localStorage.getItem("ncrt_user") || "{}");
  const myOrders = orders.filter((o) => o.customerName === user.fullName);

  const statusColor = (s: string) =>
    ({
      confirmed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      delivered: "bg-blue-100 text-blue-700",
    })[s] || "bg-gray-100 text-gray-700";

  const buyAgain = (order: Order) => {
    try {
      const items: OrderItem[] = JSON.parse(order.items);
      for (const i of items) addToCart(i);
      toast.success("Items added to cart");
      navigate("/cart");
    } catch {
      toast.error("Could not add items");
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-green-600 px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="orders.back_button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">My Orders</h1>
      </div>

      {myOrders.length === 0 ? (
        <div
          data-ocid="orders.empty_state"
          className="flex flex-col items-center justify-center py-24"
        >
          <span className="text-6xl">📦</span>
          <p className="text-gray-500 mt-4 text-sm">No orders yet</p>
          <button
            type="button"
            data-ocid="orders.primary_button"
            onClick={() => navigate("/home")}
            className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="px-4 mt-4 space-y-3">
          {myOrders.map((order, idx) => {
            const items: OrderItem[] = (() => {
              try {
                return JSON.parse(order.items);
              } catch {
                return [];
              }
            })();
            return (
              <div
                key={order.id}
                data-ocid={`orders.item.${idx + 1}`}
                className="bg-white rounded-2xl shadow-sm p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">
                    Order #{order.id.slice(-6)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {items.slice(0, 3).map((i) => (
                    <p key={i.productId} className="text-sm text-gray-600">
                      {i.name} × {i.quantity}
                    </p>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-400">
                      +{items.length - 3} more
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-bold">
                    ₹{order.totalAmount}
                  </span>
                  <button
                    type="button"
                    data-ocid={`orders.item.${idx + 1}.button`}
                    onClick={() => buyAgain(order)}
                    className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                  >
                    <RotateCcw size={12} /> Buy Again
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNav />
    </div>
  );
}
