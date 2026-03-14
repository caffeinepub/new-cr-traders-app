import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛒</span>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                data-ocid="signin.input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                data-ocid="signin.password_input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              data-ocid="signin.submit_button"
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold text-sm hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            New customer?{" "}
            <Link
              data-ocid="signin.signup_link"
              to="/signup"
              className="text-green-600 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
