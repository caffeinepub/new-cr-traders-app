import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "../lib/router";
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from "./Home";

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
interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: string;
  totalAmount: string;
  status: string;
  createdAt: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"products" | "categories" | "orders">(
    "products",
  );
  const [products, setProducts] = useState<Product[]>(() =>
    JSON.parse(
      localStorage.getItem("ncrt_products") || JSON.stringify(DEFAULT_PRODUCTS),
    ),
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    JSON.parse(
      localStorage.getItem("ncrt_categories") ||
        JSON.stringify(DEFAULT_CATEGORIES),
    ),
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    JSON.parse(localStorage.getItem("ncrt_orders") || "[]"),
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

  const updateOrderStatus = (id: string, status: string) => {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("ncrt_orders", JSON.stringify(updated));
    toast.success("Order status updated");
  };

  const logout = () => {
    localStorage.removeItem("ncrt_admin");
    navigate("/signin");
  };

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
      <div className="grid grid-cols-3 gap-3 px-4 mt-4">
        {[
          { label: "Products", value: products.length, color: "bg-green-500" },
          {
            label: "Categories",
            value: categories.length,
            color: "bg-blue-500",
          },
          { label: "Orders", value: orders.length, color: "bg-purple-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-3 shadow-sm text-center"
          >
            <p
              className={`text-xl font-bold text-${s.color.split("-")[1]}-600`}
            >
              {s.value}
            </p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white mx-4 mt-4 rounded-t-xl overflow-hidden">
        {(["products", "categories", "orders"] as const).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`admin.${t}.tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize ${tab === t ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
          >
            {t}
          </button>
        ))}
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
                  className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3"
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
          <div className="mt-3 space-y-3">
            {orders.length === 0 ? (
              <div
                data-ocid="admin.orders.empty_state"
                className="text-center py-12 text-gray-400"
              >
                <p className="text-4xl mb-2">📋</p>
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              orders.map((order, idx) => (
                <div
                  key={order.id}
                  data-ocid={`admin.order.${idx + 1}`}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.customerPhone}
                      </p>
                    </div>
                    <span className="text-green-700 font-bold text-sm">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    📍 {order.deliveryAddress}
                  </p>
                  <div className="mb-2">
                    {(() => {
                      try {
                        return JSON.parse(order.items)
                          .slice(0, 2)
                          .map(
                            (i: {
                              productId: string;
                              name: string;
                              quantity: number;
                            }) => (
                              <p
                                key={i.productId}
                                className="text-xs text-gray-600"
                              >
                                {i.name} × {i.quantity}
                              </p>
                            ),
                          );
                      } catch {
                        return null;
                      }
                    })()}
                  </div>
                  <select
                    data-ocid={`admin.order.${idx + 1}.status_select`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
