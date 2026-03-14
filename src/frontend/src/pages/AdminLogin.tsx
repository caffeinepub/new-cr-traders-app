import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (phone === "9358251328" && pin === "NCR9358") {
      localStorage.setItem("ncrt_admin", "1");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500">NEW C.R. TRADERS</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              data-ocid="admin_login.phone_input"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Admin phone number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              PIN
            </label>
            <input
              data-ocid="admin_login.pin_input"
              type="password"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter PIN"
            />
          </div>
          <button
            data-ocid="admin_login.submit_button"
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button
          type="button"
          data-ocid="admin_login.back_button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 text-gray-500 text-sm"
        >
          ← Back to App
        </button>
      </div>
    </div>
  );
}
