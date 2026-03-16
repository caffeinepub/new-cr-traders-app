import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Info,
  LogOut,
  Mail,
  Phone,
  RefreshCw,
  Shield,
  Star,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useApp } from "../contexts/AppContext";
import { useNavigate } from "../lib/router";
import type { LangKey } from "../lib/translations";

const LANGUAGES: { key: LangKey; flag: string; label: string }[] = [
  { key: "English", flag: "🇬🇧", label: "English" },
  { key: "Hindi", flag: "🇮🇳", label: "हिंदी" },
  { key: "Marathi", flag: "🇮🇳", label: "मराठी" },
  { key: "Bengali", flag: "🇮🇳", label: "বাংলা" },
  { key: "Punjabi", flag: "🇮🇳", label: "ਪੰਜਾਬੀ" },
  { key: "Kannada", flag: "🇮🇳", label: "ಕನ್ನಡ" },
  { key: "Malayalam", flag: "🇮🇳", label: "മലയാളം" },
];

type InfoSection = "about" | "privacy" | "return" | "care" | "feedback" | null;

export default function Settings() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useApp();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("ncrt_user") || "{}"),
  );
  const [tab, setTab] = useState("profile");
  const [openSection, setOpenSection] = useState<InfoSection>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const saveProfile = () => {
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const updated = users.map((u: { id: string }) =>
      u.id === user.id ? user : u,
    );
    localStorage.setItem("ncrt_users", JSON.stringify(updated));
    localStorage.setItem("ncrt_user", JSON.stringify(user));
    toast.success(t("profile_updated"));
  };

  const logout = () => {
    localStorage.removeItem("ncrt_user");
    navigate("/signin");
  };

  const changeLang = (selectedLang: LangKey) => {
    setLanguage(selectedLang);
    toast.success(`Language: ${selectedLang}`);
  };

  const toggleSection = (section: InfoSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  const submitFeedback = () => {
    if (feedbackRating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    const storedUser = JSON.parse(localStorage.getItem("ncrt_user") || "{}");
    const feedbacks = JSON.parse(
      localStorage.getItem("ncrt_feedbacks") || "[]",
    );
    feedbacks.push({
      rating: feedbackRating,
      message: feedbackText.trim(),
      date: new Date().toISOString(),
      userName: storedUser.fullName || storedUser.phone || "Guest",
    });
    localStorage.setItem("ncrt_feedbacks", JSON.stringify(feedbacks));
    toast.success("Thank you for your feedback! ⭐");
    setFeedbackRating(0);
    setFeedbackText("");
    setHoverRating(0);
  };

  const appUrl = window.location.origin;

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="bg-green-700 px-4 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="settings.back_button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
          <h1 className="text-white font-bold text-lg">{t("settings")}</h1>
        </div>
        <button
          type="button"
          data-ocid="settings.toggle"
          onClick={logout}
          className="text-white flex items-center gap-1 text-sm"
        >
          <LogOut size={16} /> {t("logout")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        {["profile", "language", "barcode", "info"].map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            data-ocid="settings.tab"
            onClick={() => setTab(tabKey)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
              tab === tabKey
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {tabKey === "profile"
              ? `👤 ${t("profile")}`
              : tabKey === "language"
                ? `🌐 ${t("language")}`
                : tabKey === "barcode"
                  ? `📱 ${t("barcode")}`
                  : "ℹ️ Info"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="px-4 mt-4 space-y-3">
          <div>
            <label
              htmlFor="st-fullname"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("full_name")}
            </label>
            <input
              id="st-fullname"
              data-ocid="settings.input"
              type="text"
              value={user.fullName || ""}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="st-phone"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("phone")}
            </label>
            <input
              id="st-phone"
              data-ocid="settings.input"
              type="tel"
              value={user.phone || ""}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="st-address"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("address")}
            </label>
            <textarea
              id="st-address"
              data-ocid="settings.textarea"
              value={user.address || ""}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="st-city"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              {t("city")}
            </label>
            <input
              id="st-city"
              data-ocid="settings.input"
              type="text"
              value={user.city || ""}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>
          <button
            type="button"
            data-ocid="settings.save_button"
            onClick={saveProfile}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm"
          >
            {t("save_changes")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full border border-green-600 text-green-700 py-3 rounded-xl font-semibold text-sm mt-2"
          >
            🔐 {t("admin_dashboard")}
          </button>
        </div>
      )}

      {/* Language Tab */}
      {tab === "language" && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <p className="text-sm font-bold text-gray-800 mb-3">
              {t("quick_lang")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  data-ocid="settings.toggle"
                  onClick={() => changeLang(l.key)}
                  className={`flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-colors ${
                    language === l.key
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                  {language === l.key && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Barcode Tab */}
      {tab === "barcode" && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
            <p className="text-sm font-bold text-gray-800 mb-4">
              {t("share_app")}
            </p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`}
              alt="QR Code"
              className="w-48 h-48"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <p className="text-xs text-gray-500 mt-4 text-center">
              {t("scan_to_open")}
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center break-all">
              {appUrl}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              {t("shop_details")}
            </p>
            <p className="text-xs text-gray-600">NEW C.R. TRADERS</p>
            <p className="text-xs text-gray-500">
              Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas
            </p>
            <p className="text-xs text-gray-500">Aligarh – 202001, UP</p>
            <p className="text-xs text-gray-500 mt-1">📞 9358251328</p>
            <p className="text-xs text-gray-400 mt-1">GSTIN: 09BTFPK1482H1ZK</p>
            <p className="text-xs text-gray-400">FSSAI: 22727411000024</p>
          </div>
        </div>
      )}

      {/* Info Tab */}
      {tab === "info" && (
        <div className="px-4 mt-4 space-y-3">
          {/* Customer Care */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              data-ocid="settings.toggle"
              onClick={() => toggleSection("care")}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone size={18} className="text-green-700" />
                </div>
                <span className="font-semibold text-sm text-gray-800">
                  Customer Care
                </span>
              </div>
              {openSection === "care" ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
            {openSection === "care" && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mt-3">
                  For any queries, complaints or order-related help, contact us:
                </p>
                <a
                  href="tel:9358351328"
                  className="flex items-center gap-3 bg-green-50 rounded-xl px-4 py-3"
                >
                  <Phone size={18} className="text-green-700" />
                  <div>
                    <p className="text-sm font-bold text-green-800">
                      9358351328
                    </p>
                    <p className="text-xs text-gray-500">Call / WhatsApp</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/919358351328"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-green-600 rounded-xl px-4 py-3"
                >
                  <span className="text-white text-lg">💬</span>
                  <div>
                    <p className="text-sm font-bold text-white">WhatsApp Us</p>
                    <p className="text-xs text-green-100">9358351328</p>
                  </div>
                </a>
                <a
                  href="mailto:crtradersshop@gmail.com"
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                >
                  <Mail size={18} className="text-gray-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      crtradersshop@gmail.com
                    </p>
                    <p className="text-xs text-gray-500">Email Support</p>
                  </div>
                </a>
                <p className="text-xs text-gray-400">
                  Shop Hours: 8:00 AM – 9:00 PM (Mon–Sun)
                </p>
                <p className="text-xs text-gray-400">
                  Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh –
                  202001
                </p>
              </div>
            )}
          </div>

          {/* About Us */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              data-ocid="settings.toggle"
              onClick={() => toggleSection("about")}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                  <Info size={18} className="text-orange-600" />
                </div>
                <span className="font-semibold text-sm text-gray-800">
                  About Us
                </span>
              </div>
              {openSection === "about" ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
            {openSection === "about" && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-bold text-gray-800">
                    🏪 NEW C.R. TRADERS
                  </p>
                  <p className="text-xs text-gray-600">
                    Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh –
                    202001, Uttar Pradesh, India
                  </p>
                  <p className="text-xs text-gray-600">
                    📞 9358251328 | 9358351328
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    We are a trusted vegetarian grocery store in Aligarh,
                    offering a wide range of quality dal, chana, masale, namak,
                    puja samagri, dry fruits, and more. All products are 100%
                    vegetarian.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-1">
                    <p className="text-xs font-semibold text-gray-700">
                      Legal Information
                    </p>
                    <p className="text-xs text-gray-600">
                      GSTIN:{" "}
                      <span className="font-mono font-semibold">
                        09BTFPK1482H1ZK
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      FSSAI:{" "}
                      <span className="font-mono font-semibold">
                        22727411000024
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Privacy Policy */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              data-ocid="settings.toggle"
              onClick={() => toggleSection("privacy")}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield size={18} className="text-blue-600" />
                </div>
                <span className="font-semibold text-sm text-gray-800">
                  Privacy Policy
                </span>
              </div>
              {openSection === "privacy" ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
            {openSection === "privacy" && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 space-y-3 text-xs text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-800">
                    Privacy Policy – NEW C.R. TRADERS
                  </p>
                  <p>
                    We collect your name, phone number, email, and address only
                    to process your orders and improve your shopping experience.
                    Your data is never sold or shared with third parties.
                  </p>
                  <p>
                    <span className="font-semibold">Order Data:</span> Orders
                    placed via WhatsApp are managed by the shop owner only. No
                    payment data is stored in the app.
                  </p>
                  <p>
                    <span className="font-semibold">Personal Information:</span>{" "}
                    You can update or delete your profile at any time from the
                    Settings page.
                  </p>
                  <p>
                    <span className="font-semibold">
                      Cookies &amp; Storage:
                    </span>{" "}
                    The app uses local storage on your device to save cart and
                    preferences. No external tracking cookies are used.
                  </p>
                  <p>
                    <span className="font-semibold">Contact for Privacy:</span>{" "}
                    crtradersshop@gmail.com | 9358351328
                  </p>
                  <p className="text-gray-400">Last updated: March 2026</p>
                </div>
              </div>
            )}
          </div>

          {/* Return Policy */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              data-ocid="settings.toggle"
              onClick={() => toggleSection("return")}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                  <RefreshCw size={18} className="text-purple-600" />
                </div>
                <span className="font-semibold text-sm text-gray-800">
                  Return &amp; Refund Policy
                </span>
              </div>
              {openSection === "return" ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
            {openSection === "return" && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-3 space-y-3 text-xs text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-800">
                    Return &amp; Refund Policy – NEW C.R. TRADERS
                  </p>
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="font-semibold text-green-800">
                      ✅ Return Accepted If:
                    </p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>
                        Product is damaged or defective at the time of pickup
                      </li>
                      <li>Wrong item was given</li>
                      <li>Item is expired or near expiry</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="font-semibold text-red-800">
                      ❌ Return Not Accepted If:
                    </p>
                    <ul className="mt-1 space-y-1 list-disc list-inside">
                      <li>Product has been used or opened</li>
                      <li>Return request made after 24 hours of pickup</li>
                      <li>Unpacked products once weighed and handed over</li>
                    </ul>
                  </div>
                  <p>
                    <span className="font-semibold">How to Return:</span> Visit
                    the shop within 24 hours of pickup with the product and your
                    order details.
                  </p>
                  <p>
                    <span className="font-semibold">Refund:</span> Refunds are
                    processed as store credit or cash at the shop counter.
                  </p>
                  <p>
                    <span className="font-semibold">For queries:</span> Call or
                    WhatsApp 9358351328
                  </p>
                  <p className="text-gray-400">
                    Mahavir Ganj, Aligarh – 202001
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Send Feedback */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button
              type="button"
              data-ocid="settings.toggle"
              onClick={() => toggleSection("feedback")}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star size={18} className="text-yellow-500" />
                </div>
                <span className="font-semibold text-sm text-gray-800">
                  Send Feedback
                </span>
              </div>
              {openSection === "feedback" ? (
                <ChevronDown size={18} className="text-gray-400" />
              ) : (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
            {openSection === "feedback" && (
              <div className="px-4 pb-5 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-800 mt-4 mb-1 text-center">
                  Rate Your Experience
                </p>
                <p className="text-xs text-gray-500 text-center mb-4">
                  How satisfied are you with NEW C.R. TRADERS?
                </p>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      data-ocid="settings.toggle"
                      onClick={() => setFeedbackRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110 active:scale-95"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        size={36}
                        className={`transition-colors ${
                          star <= (hoverRating || feedbackRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating label */}
                {(hoverRating || feedbackRating) > 0 && (
                  <p className="text-center text-xs font-semibold text-yellow-600 mb-3">
                    {
                      ["Poor", "Fair", "Good", "Very Good", "Excellent!"][
                        (hoverRating || feedbackRating) - 1
                      ]
                    }
                  </p>
                )}

                {/* Textarea */}
                <textarea
                  data-ocid="settings.textarea"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your thoughts... (optional)"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 resize-none mb-3"
                />

                {/* Submit */}
                <button
                  type="button"
                  data-ocid="settings.submit_button"
                  onClick={submitFeedback}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  ⭐ Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
