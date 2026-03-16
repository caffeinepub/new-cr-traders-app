import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "../lib/router";

const ADMIN_EMAILS = [
  "crtradersshop@gmail.com",
  "yatishvarshney796@gmail.com",
  "sakshamvarshney028@gmail.com",
  "real.truth.by.saksham@gmail.com",
];

const ADMIN_PHONE = "9358251328";
const ADMIN_PIN = "NCR9358";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let valid = false;
    if (loginType === "email") {
      valid =
        ADMIN_EMAILS.includes(email.trim().toLowerCase()) && pin === ADMIN_PIN;
    } else {
      valid = phone === ADMIN_PHONE && pin === ADMIN_PIN;
    }

    setTimeout(() => {
      if (valid) {
        localStorage.setItem("ncrt_admin", "1");
        navigate("/admin/dashboard");
      } else {
        toast.error(
          "Invalid credentials. Please check your email/phone and PIN.",
        );
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <img
            src="/assets/uploads/WhatsApp-Image-2026-03-15-at-3.53.33-PM-2.jpeg"
            alt="NEW CR TRADERS"
            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-sm text-gray-500">NEW C.R. TRADERS</p>
        </div>

        {/* Toggle Email / Phone */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          <button
            type="button"
            data-ocid="admin_login.email_tab"
            onClick={() => setLoginType("email")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              loginType === "email"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            data-ocid="admin_login.phone_tab"
            onClick={() => setLoginType("phone")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              loginType === "phone"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500"
            }`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === "email" ? (
            <div>
              <label
                htmlFor="al-email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Admin Email
              </label>
              <input
                id="al-email"
                data-ocid="admin_login.email_input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter admin email"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="al-phone"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="al-phone"
                data-ocid="admin_login.phone_input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Admin phone number"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="al-pin"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              PIN
            </label>
            <input
              id="al-pin"
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
          onClick={() => navigate("/home")}
          className="w-full mt-3 text-gray-500 text-sm"
        >
          Back to App
        </button>
      </div>
    </div>
  );
}
