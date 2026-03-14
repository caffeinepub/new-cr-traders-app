import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TERMS = `TERMS AND CONDITIONS - NEW C.R. TRADERS

1. ABOUT US
NEW C.R. TRADERS (New Chitarmal Ram Prasad Traders) is a grocery shop located at Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh - 202001, Uttar Pradesh, India.

GSTIN: 09BTFPK1482H1ZK
FSSAI License No: 22727411000024
Contact: 9358251328

2. DELIVERY AREA
We currently deliver ONLY within Aligarh city. Orders from outside Aligarh will not be processed.

3. PRODUCT QUALITY
All products are of high quality. We sell only genuine branded and unbranded products with proper certification.

4. RETURNS & REFUNDS
Damaged or wrong items can be returned within 24 hours of delivery. Contact us on WhatsApp: 9358251328.

5. PRICING
All prices include applicable taxes. Prices may change without prior notice.

6. ORDERS
Orders are confirmed via WhatsApp. Delivery time may vary based on location within Aligarh.

7. PRIVACY
Your personal information (name, phone, address) is used only for order processing and delivery. We do not share your data with third parties.

8. BY CREATING AN ACCOUNT
You agree to all terms above and confirm that you reside in or are ordering for delivery within Aligarh, UP.`;

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
      toast.error("Please accept the terms and conditions");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
      if (users.find((u: { email: string }) => u.email === form.email)) {
        toast.error("Email already registered");
        setLoading(false);
        return;
      }
      const user = { ...form, id: Date.now().toString() };
      users.push(user);
      localStorage.setItem("ncrt_users", JSON.stringify(users));
      localStorage.setItem("ncrt_user", JSON.stringify(user));
      navigate("/home");
    } catch {
      toast.error("Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🛒</span>
          </div>
          <h1 className="text-xl font-bold text-green-800">Create Account</h1>
          <p className="text-sm text-gray-500">NEW C.R. TRADERS</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            {
              key: "fullName",
              label: "Full Name",
              type: "text",
              placeholder: "Your full name",
            },
            {
              key: "email",
              label: "Email",
              type: "email",
              placeholder: "your@email.com",
            },
            {
              key: "phone",
              label: "Phone Number",
              type: "tel",
              placeholder: "10-digit mobile number",
            },
            {
              key: "address",
              label: "Address",
              type: "text",
              placeholder: "Street / Mohalla",
            },
            {
              key: "city",
              label: "City",
              type: "text",
              placeholder: "City (e.g. Aligarh)",
            },
            {
              key: "state",
              label: "State",
              type: "text",
              placeholder: "State (e.g. Uttar Pradesh)",
            },
            {
              key: "password",
              label: "Password",
              type: "password",
              placeholder: "Create password",
            },
            {
              key: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              placeholder: "Repeat password",
            },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                data-ocid={`signup.${field.key}_input`}
                type={field.type}
                required
                value={form[field.key as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Terms & Conditions (please read completely)
            </label>
            <textarea
              data-ocid="signup.terms_textarea"
              readOnly
              value={TERMS}
              onScroll={handleScroll}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs h-32 resize-none focus:outline-none bg-gray-50"
            />
            {!termsRead && (
              <p className="text-xs text-orange-500 mt-1">
                Please scroll to the bottom to read all terms
              </p>
            )}
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              data-ocid="signup.terms_checkbox"
              type="checkbox"
              disabled={!termsRead}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 accent-green-600"
            />
            <span className="text-xs text-gray-600">
              I have read and agree to the Terms & Conditions
            </span>
          </label>
          <button
            data-ocid="signup.submit_button"
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full bg-green-600 text-white rounded-lg py-3 font-semibold text-sm hover:bg-green-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            data-ocid="signup.signin_link"
            to="/signin"
            className="text-green-600 font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
