import {
  CheckCircle,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { AnonOrder } from "../backend";
import { useActor } from "../hooks/useActor";
import { useNavigate } from "../lib/router";
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./Home";

const PRODUCT_VERSION = "v39";
const ADMIN_PIN = "NCR9358";

interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  size: string;
  isPacked: boolean;
  price: string;
  imageUrl: string;
  isAvailable: boolean;
  brand?: string;
  mrp?: string;
}
interface Category {
  id: string;
  name: string;
  emoji: string;
}
interface LocalOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: string;
  totalAmount: string;
  status: string;
  createdAt: number;
}
interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  address?: string;
  city?: string;
  state?: string;
}

// Merged order type that handles both local and backend orders
interface MergedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: string;
  totalAmount: string;
  status: string;
  createdAt: number; // always milliseconds
  isBackend: boolean;
}

function toMergedOrder(o: AnonOrder): MergedOrder {
  return {
    id: o.id,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    deliveryAddress: o.deliveryAddress,
    items: o.items,
    totalAmount: o.totalAmount,
    status: o.status,
    createdAt: Number(o.createdAt) / 1_000_000, // nanoseconds → ms
    isBackend: true,
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [tab, setTab] = useState<
    "products" | "categories" | "orders" | "customers"
  >("products");
  const [products, setProducts] = useState<Product[]>(() => {
    const storedVersion = localStorage.getItem("ncrt_product_version");
    if (storedVersion !== PRODUCT_VERSION) {
      localStorage.removeItem("ncrt_products");
      localStorage.removeItem("ncrt_categories");
      localStorage.setItem("ncrt_product_version", PRODUCT_VERSION);
    }
    return JSON.parse(
      localStorage.getItem("ncrt_products") || JSON.stringify(DEFAULT_PRODUCTS),
    );
  });
  const [categories, setCategories] = useState<Category[]>(() =>
    JSON.parse(
      localStorage.getItem("ncrt_categories") ||
        JSON.stringify(DEFAULT_CATEGORIES),
    ),
  );
  const [orders, setOrders] = useState<MergedOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(() =>
    JSON.parse(localStorage.getItem("ncrt_users") || "[]"),
  );
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newProd, setNewProd] = useState<Partial<Product>>({
    isPacked: true,
    isAvailable: true,
  });
  const [newCat, setNewCat] = useState<Partial<Category>>({});

  useEffect(() => {
    if (!localStorage.getItem("ncrt_admin")) navigate("/admin");
  }, [navigate]);

  // Fetch orders from backend and merge with localStorage
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    const localOrders: LocalOrder[] = JSON.parse(
      localStorage.getItem("ncrt_orders") || "[]",
    );
    const localMerged: MergedOrder[] = localOrders.map((o) => ({
      ...o,
      isBackend: false,
    }));

    try {
      if (actor) {
        const backendOrders = await actor.getAllOrdersAdmin(ADMIN_PIN);
        const backendMerged = backendOrders.map(toMergedOrder);
        // Merge: prefer backend orders, use local as fallback for those not in backend
        const backendIds = new Set(backendMerged.map((o) => o.id));
        const localOnly = localMerged.filter((o) => !backendIds.has(o.id));
        const combined = [...backendMerged, ...localOnly].sort(
          (a, b) => b.createdAt - a.createdAt,
        );
        setOrders(combined);
      } else {
        setOrders(localMerged.sort((a, b) => b.createdAt - a.createdAt));
      }
    } catch (e) {
      console.error("Failed to fetch backend orders", e);
      // Fallback to localStorage only
      setOrders(localMerged.sort((a, b) => b.createdAt - a.createdAt));
      toast.error("Could not load backend orders, showing local orders");
    } finally {
      setOrdersLoading(false);
    }
  }, [actor]);

  // Fetch orders when tab switches to orders
  useEffect(() => {
    if (tab === "orders") {
      fetchOrders();
    }
  }, [tab, fetchOrders]);

  const saveProducts = (p: Product[]) => {
    setProducts(p);
    localStorage.setItem("ncrt_products", JSON.stringify(p));
  };
  const saveCategories = (c: Category[]) => {
    setCategories(c);
    localStorage.setItem("ncrt_categories", JSON.stringify(c));
  };

  const deleteProduct = (id: string) => {
    saveProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };
  const toggleAvailability = (id: string) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, isAvailable: !p.isAvailable } : p,
    );
    saveProducts(updated);
    const prod = updated.find((p) => p.id === id);
    toast.success(
      prod?.isAvailable
        ? "Product marked Available"
        : "Product marked Unavailable",
    );
  };
  const deleteCategory = (id: string) => {
    saveCategories(categories.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const addProduct = () => {
    if (!newProd.name || !newProd.price || !newProd.categoryId) {
      toast.error("Name, price, and category required");
      return;
    }
    const p = {
      ...newProd,
      id: Date.now().toString(),
      isPacked: newProd.isPacked ?? true,
      isAvailable: newProd.isAvailable ?? true,
      description: newProd.description || "",
      size: newProd.size || "",
      imageUrl:
        newProd.imageUrl ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300",
    } as Product;
    saveProducts([...products, p]);
    setShowAddProduct(false);
    setNewProd({ isPacked: true, isAvailable: true });
    toast.success("Product added");
  };

  const addCategory = () => {
    if (!newCat.name) {
      toast.error("Category name required");
      return;
    }
    const c = {
      ...newCat,
      id: Date.now().toString(),
      emoji: newCat.emoji || "🛒",
    } as Category;
    saveCategories([...categories, c]);
    setShowAddCategory(false);
    setNewCat({});
    toast.success("Category added");
  };

  const saveEditProduct = () => {
    if (!editProduct) return;
    saveProducts(
      products.map((p) => (p.id === editProduct.id ? editProduct : p)),
    );
    setEditProduct(null);
    toast.success("Product updated");
  };

  const updateOrderStatus = async (order: MergedOrder, status: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status } : o)),
    );

    // Update localStorage orders too
    const localOrders: LocalOrder[] = JSON.parse(
      localStorage.getItem("ncrt_orders") || "[]",
    );
    const updatedLocal = localOrders.map((o) =>
      o.id === order.id ? { ...o, status } : o,
    );
    localStorage.setItem("ncrt_orders", JSON.stringify(updatedLocal));

    // If backend order, also update on backend
    if (order.isBackend && actor) {
      try {
        await actor.updateOrderStatusAdmin(order.id, status, ADMIN_PIN);
        toast.success("Order status updated");
      } catch (e) {
        console.error("Backend status update failed", e);
        toast.error("Status saved locally, backend sync failed");
      }
    } else {
      toast.success("Order status updated");
    }
  };

  const refreshCustomers = () => {
    const fresh = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    setCustomers(fresh);
    toast.success(`${fresh.length} customer(s) loaded`);
  };

  const logout = () => {
    localStorage.removeItem("ncrt_admin");
    navigate("/signin");
  };

  const AVATAR_COLORS = [
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-purple-500",
    "bg-cyan-500",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 px-4 pt-10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
          <p className="text-gray-400 text-xs">NEW C.R. TRADERS</p>
        </div>
        <button
          type="button"
          data-ocid="admin.logout_button"
          onClick={logout}
          className="text-white flex items-center gap-1 text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 mt-4">
        {[
          {
            label: "Products",
            value: products.length,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Categories",
            value: categories.length,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Orders",
            value: orders.length,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "Customers",
            value: customers.length,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 shadow-sm text-center"
          >
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white mx-4 mt-4 rounded-t-xl overflow-hidden">
        {(["products", "categories", "orders", "customers"] as const).map(
          (t) => (
            <button
              type="button"
              key={t}
              data-ocid={`admin.${t}.tab`}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold capitalize ${
                tab === t
                  ? "border-b-2 border-green-600 text-green-700"
                  : "text-gray-500"
              }`}
            >
              {t}
            </button>
          ),
        )}
      </div>

      <div className="px-4 pb-8">
        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <button
              type="button"
              data-ocid="admin.add_product_button"
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold mt-3 mb-3"
            >
              <Plus size={16} /> Add Product
            </button>

            {showAddProduct && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm space-y-2">
                <p className="font-semibold text-sm">New Product</p>
                {(
                  [
                    "name",
                    "size",
                    "price",
                    "mrp",
                    "brand",
                    "imageUrl",
                    "description",
                  ] as const
                ).map((f) => (
                  <input
                    key={f}
                    data-ocid={`admin.new_product.${f}_input`}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    value={(newProd as Record<string, string>)[f] || ""}
                    onChange={(e) =>
                      setNewProd((p) => ({ ...p, [f]: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                ))}
                <select
                  data-ocid="admin.new_product.category_select"
                  value={newProd.categoryId || ""}
                  onChange={(e) =>
                    setNewProd((p) => ({ ...p, categoryId: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newProd.isPacked}
                      onChange={(e) =>
                        setNewProd((p) => ({
                          ...p,
                          isPacked: e.target.checked,
                        }))
                      }
                    />{" "}
                    Packed
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newProd.isAvailable}
                      onChange={(e) =>
                        setNewProd((p) => ({
                          ...p,
                          isAvailable: e.target.checked,
                        }))
                      }
                    />{" "}
                    Available
                  </label>
                </div>
                <button
                  type="button"
                  data-ocid="admin.new_product.save_button"
                  onClick={addProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Save Product
                </button>
              </div>
            )}

            <div className="space-y-2">
              {products.map((p, idx) => (
                <div
                  key={p.id}
                  data-ocid={`admin.product.${idx + 1}`}
                  className={`rounded-2xl p-3 shadow-sm flex items-center gap-3 ${p.isAvailable ? "bg-white" : "bg-gray-50 opacity-70"}`}
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100";
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">
                      {p.size} · ₹{p.price}
                    </p>
                    <p className="text-xs text-gray-400">
                      {!p.isAvailable && "(Unavailable)"}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid={`admin.product.${idx + 1}.toggle`}
                    onClick={() => toggleAvailability(p.id)}
                    className={`p-1.5 rounded-lg ${p.isAvailable ? "bg-green-50" : "bg-gray-100"}`}
                    title={
                      p.isAvailable ? "Mark Unavailable" : "Mark Available"
                    }
                  >
                    {p.isAvailable ? (
                      <CheckCircle size={14} className="text-green-600" />
                    ) : (
                      <XCircle size={14} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    type="button"
                    data-ocid={`admin.product.${idx + 1}.edit_button`}
                    onClick={() => setEditProduct(p)}
                    className="p-1.5 bg-blue-50 rounded-lg"
                  >
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`admin.product.${idx + 1}.delete_button`}
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
            <div
              data-ocid="admin.edit_product.dialog"
              className="bg-white rounded-t-3xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto"
            >
              <h3 className="font-bold text-base mb-4">Edit Product</h3>
              <div className="space-y-2">
                {(
                  [
                    "name",
                    "size",
                    "price",
                    "mrp",
                    "brand",
                    "imageUrl",
                    "description",
                  ] as const
                ).map((f) => (
                  <input
                    key={f}
                    placeholder={f}
                    value={
                      (editProduct as unknown as Record<string, string>)[f] ||
                      ""
                    }
                    onChange={(e) =>
                      setEditProduct((p) =>
                        p ? { ...p, [f]: e.target.value } : p,
                      )
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                ))}
                <select
                  value={editProduct.categoryId}
                  onChange={(e) =>
                    setEditProduct((p) =>
                      p ? { ...p, categoryId: e.target.value } : p,
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editProduct.isPacked}
                      onChange={(e) =>
                        setEditProduct((p) =>
                          p ? { ...p, isPacked: e.target.checked } : p,
                        )
                      }
                    />{" "}
                    Packed
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editProduct.isAvailable}
                      onChange={(e) =>
                        setEditProduct((p) =>
                          p ? { ...p, isAvailable: e.target.checked } : p,
                        )
                      }
                    />{" "}
                    Available
                  </label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  data-ocid="admin.edit_product.save_button"
                  onClick={saveEditProduct}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  data-ocid="admin.edit_product.cancel_button"
                  onClick={() => setEditProduct(null)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && (
          <div>
            <button
              type="button"
              data-ocid="admin.add_category_button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold mt-3 mb-3"
            >
              <Plus size={16} /> Add Category
            </button>
            {showAddCategory && (
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm space-y-2">
                <input
                  data-ocid="admin.new_category.name_input"
                  placeholder="Category name"
                  value={newCat.name || ""}
                  onChange={(e) =>
                    setNewCat((c) => ({ ...c, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  data-ocid="admin.new_category.emoji_input"
                  placeholder="Emoji (e.g. 🥦)"
                  value={newCat.emoji || ""}
                  onChange={(e) =>
                    setNewCat((c) => ({ ...c, emoji: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  data-ocid="admin.new_category.save_button"
                  onClick={addCategory}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Save
                </button>
              </div>
            )}
            <div className="space-y-2">
              {categories.map((c, idx) => (
                <div
                  key={c.id}
                  data-ocid={`admin.category.${idx + 1}`}
                  className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="flex-1 font-medium text-sm">{c.name}</span>
                  <button
                    type="button"
                    data-ocid={`admin.category.${idx + 1}.edit_button`}
                    onClick={() => setEditCategory(c)}
                    className="p-1.5 bg-blue-50 rounded-lg"
                  >
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`admin.category.${idx + 1}.delete_button`}
                    onClick={() => deleteCategory(c.id)}
                    className="p-1.5 bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {editCategory && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
            <div
              data-ocid="admin.edit_category.dialog"
              className="bg-white rounded-t-3xl w-full max-w-md p-6"
            >
              <h3 className="font-bold text-base mb-4">Edit Category</h3>
              <div className="space-y-2">
                <input
                  placeholder="Name"
                  value={editCategory.name}
                  onChange={(e) =>
                    setEditCategory((c) =>
                      c ? { ...c, name: e.target.value } : c,
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                  placeholder="Emoji"
                  value={editCategory.emoji}
                  onChange={(e) =>
                    setEditCategory((c) =>
                      c ? { ...c, emoji: e.target.value } : c,
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  data-ocid="admin.edit_category.save_button"
                  onClick={() => {
                    saveCategories(
                      categories.map((c) =>
                        c.id === editCategory!.id ? editCategory! : c,
                      ),
                    );
                    setEditCategory(null);
                    toast.success("Category updated");
                  }}
                  className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  data-ocid="admin.edit_category.cancel_button"
                  onClick={() => setEditCategory(null)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {ordersLoading
                  ? "Loading orders..."
                  : `${orders.length} Order${orders.length !== 1 ? "s" : ""}`}
              </p>
              <button
                type="button"
                data-ocid="admin.orders.refresh_button"
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-purple-100 disabled:opacity-50"
              >
                {ordersLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <RefreshCw size={13} />
                )}
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div
                data-ocid="admin.orders.loading_state"
                className="flex flex-col items-center justify-center py-16 text-gray-400"
              >
                <Loader2
                  size={32}
                  className="animate-spin text-purple-400 mb-3"
                />
                <p className="text-sm">Fetching orders from server...</p>
              </div>
            ) : orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-12 text-gray-400"
              >
                <p className="text-4xl mb-2">📋</p>
                <p className="text-sm">No orders yet</p>
                <p className="text-xs mt-1 text-gray-300">
                  Orders placed by customers will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div
                    key={order.id}
                    data-ocid={`admin.order.${idx + 1}`}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">
                            {order.customerName || "Guest"}
                          </p>
                          {order.isBackend && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                              ✓ Synced
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {order.customerPhone}
                        </p>
                        <p className="text-xs text-gray-400">
                          🕐 {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <span className="text-green-700 font-bold text-sm">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    {order.deliveryAddress && (
                      <p className="text-xs text-gray-500 mb-2">
                        📍 {order.deliveryAddress}
                      </p>
                    )}
                    <div className="mb-3 bg-gray-50 rounded-xl p-2">
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Items:
                      </p>
                      {(() => {
                        try {
                          const parsedItems = JSON.parse(order.items);
                          return parsedItems.map(
                            (
                              i: {
                                productId: string;
                                name: string;
                                quantity: number;
                                price: number;
                                size?: string;
                              },
                              iIdx: number,
                            ) => (
                              <p
                                key={`${i.productId}-${iIdx}`}
                                className="text-xs text-gray-600"
                              >
                                • {i.name}
                                {i.size ? ` (${i.size})` : ""} × {i.quantity}
                                {i.price ? ` = ₹${i.price * i.quantity}` : ""}
                              </p>
                            ),
                          );
                        } catch {
                          return (
                            <p className="text-xs text-gray-400">
                              {order.items}
                            </p>
                          );
                        }
                      })()}
                    </div>
                    <select
                      data-ocid={`admin.order.${idx + 1}.status_select`}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="ready">Ready for Pickup</option>
                      <option value="delivered">Picked Up / Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {tab === "customers" && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">
                {customers.length} Registered Customer
                {customers.length !== 1 ? "s" : ""}
              </p>
              <button
                type="button"
                data-ocid="admin.customers.refresh_button"
                onClick={refreshCustomers}
                className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-100"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {customers.length === 0 ? (
              <div
                data-ocid="admin.customers.empty_state"
                className="text-center py-16 text-gray-400"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User size={28} className="text-indigo-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No customers registered yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Customers will appear here after sign up
                </p>
              </div>
            ) : (
              <div data-ocid="admin.customers.list" className="space-y-3">
                {customers.map((customer, idx) => {
                  const initials = customer.name
                    ? customer.name
                        .trim()
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "?";
                  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const regDate =
                    customer.id && !Number.isNaN(Number(customer.id))
                      ? new Date(Number(customer.id)).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : null;
                  const addressLine = [
                    customer.address,
                    customer.city,
                    customer.state,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={customer.id || idx}
                      data-ocid={`admin.customer.${idx + 1}`}
                      className="bg-white rounded-2xl p-4 shadow-sm flex gap-3 items-start"
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor}`}
                      >
                        <span className="text-white font-bold text-sm">
                          {initials}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">
                          {customer.name || "—"}
                        </p>

                        <div className="mt-1.5 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 w-14 flex-shrink-0">
                              📱 Phone
                            </span>
                            <span className="text-xs text-gray-700 font-medium">
                              {customer.phone || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 w-14 flex-shrink-0">
                              ✉️ Email
                            </span>
                            <span className="text-xs text-gray-700 truncate">
                              {customer.email || "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 w-14 flex-shrink-0">
                              🔑 Pass
                            </span>
                            <span className="text-xs font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-800">
                              {customer.password || "—"}
                            </span>
                          </div>
                          {addressLine && (
                            <div className="flex items-start gap-1.5">
                              <span className="text-xs text-gray-400 w-14 flex-shrink-0 mt-0.5">
                                📍 Addr
                              </span>
                              <span className="text-xs text-gray-600">
                                {addressLine}
                              </span>
                            </div>
                          )}
                          {regDate && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400 w-14 flex-shrink-0">
                                📅 Reg
                              </span>
                              <span className="text-xs text-gray-500">
                                {regDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
