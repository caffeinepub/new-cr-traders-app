import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "../lib/router";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const user = users.find(
      (u: { email: string; password: string }) =>
        u.email === email && u.password === password,
    );
    if (user) {
      localStorage.setItem("ncrt_user", JSON.stringify(user));
      navigate("/home");
    } else {
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-15-at-3.53.33-PM-2.jpeg"
              alt="NEW C.R. TRADERS"
              className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-green-600 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <h1 className="text-2xl font-bold text-green-800">
              NEW C.R. TRADERS
            </h1>
            <p className="text-sm text-gray-500">
              New Chitarmal Ram Prasad Traders
            </p>
            <p className="text-xs text-gray-400 mt-1">Mahavir Ganj, Aligarh</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="signin-email"
                data-ocid="signin.input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="signin-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="signin-password"
                data-ocid="signin.input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              data-ocid="signin.submit_button"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New customer?{" "}
            <Link
              to="/signup"
              data-ocid="signin.link"
              className="text-green-600 font-semibold"
            >
              Create Account
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-3">
            Admin?{" "}
            <Link to="/admin-login" className="text-gray-500 underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
