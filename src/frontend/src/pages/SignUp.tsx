import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "../lib/router";

const TERMS = `TERMS AND CONDITIONS - NEW C.R. TRADERS

1. ABOUT US
NEW C.R. TRADERS (New Chitarmal Ram Prasad Traders) is a grocery shop located at Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh - 202001, Uttar Pradesh, India.

GSTIN: 09BTFPK1482H1ZK
FSSAI License No: 22727411000024
Contact: 9358251328

2. PICKUP ONLY
We offer PICKUP ONLY service. Customers must come to the shop to collect their orders. Mahavir Ganj, Aligarh.

3. PRODUCT QUALITY
All products are of high quality. We sell only genuine branded and unbranded products. All products are 100% vegetarian.

4. RETURNS & REFUNDS
Damaged or wrong items can be returned within 24 hours of purchase. Contact us on WhatsApp: 9358251328.

5. PRICING
All prices include applicable taxes. Prices may change without prior notice.

6. ORDERS
Orders are confirmed via WhatsApp. Customer must come to shop to collect.

7. PRIVACY
Your personal information (name, phone, address) is used only for order processing. We do not share your data with third parties.

8. BY CREATING AN ACCOUNT
You agree to all terms above.`;

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });
  const [termsRead, setTermsRead] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20)
      setTermsRead(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("Please accept terms and conditions");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.phone.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    if (users.find((u: { email: string }) => u.email === form.email)) {
      toast.error("Email already registered");
      setLoading(false);
      return;
    }
    const newUser = { ...form, id: Date.now().toString() };
    users.push(newUser);
    localStorage.setItem("ncrt_users", JSON.stringify(users));
    localStorage.setItem("ncrt_user", JSON.stringify(newUser));
    toast.success("Account created!");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-15-at-3.53.33-PM-2.jpeg"
              alt="NEW C.R. TRADERS"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-green-600 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <h1 className="text-xl font-bold text-green-800">
              NEW C.R. TRADERS
            </h1>
            <p className="text-xs text-gray-500">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="su-fullname"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                id="su-fullname"
                data-ocid="signup.input"
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label
                htmlFor="su-email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="su-email"
                data-ocid="signup.input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="su-phone"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                id="su-phone"
                data-ocid="signup.input"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label
                htmlFor="su-address"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                id="su-address"
                data-ocid="signup.input"
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor="su-city"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  id="su-city"
                  data-ocid="signup.input"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
                  placeholder="Aligarh"
                />
              </div>
              <div>
                <label
                  htmlFor="su-state"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  State
                </label>
                <input
                  id="su-state"
                  data-ocid="signup.input"
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
                  placeholder="UP"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="su-password"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Password *
              </label>
              <input
                id="su-password"
                data-ocid="signup.input"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="Create password"
              />
            </div>
            <div>
              <label
                htmlFor="su-confirm"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Confirm Password *
              </label>
              <input
                id="su-confirm"
                data-ocid="signup.input"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500"
                placeholder="Repeat password"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">
                Terms &amp; Conditions *
              </p>
              <textarea
                data-ocid="signup.textarea"
                readOnly
                value={TERMS}
                onScroll={handleScroll}
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-600 resize-none bg-gray-50"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  data-ocid="signup.checkbox"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  disabled={!termsRead}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-xs text-gray-600">
                  I have read and agree to the Terms &amp; Conditions
                </span>
              </label>
            </div>

            <button
              type="submit"
              data-ocid="signup.submit_button"
              disabled={loading || !termsAccepted}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link
              to="/signin"
              data-ocid="signup.link"
              className="text-green-600 font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
