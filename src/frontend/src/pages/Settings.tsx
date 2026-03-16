import { ArrowLeft, LogOut } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "../lib/router";

const LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Malayalam",
];

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("ncrt_user") || "{}"),
  );
  const [lang, setLang] = useState(
    () => localStorage.getItem("ncrt_lang") || "Hindi",
  );
  const [tab, setTab] = useState("profile");

  const saveProfile = () => {
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const updated = users.map((u: { id: string }) =>
      u.id === user.id ? user : u,
    );
    localStorage.setItem("ncrt_users", JSON.stringify(updated));
    localStorage.setItem("ncrt_user", JSON.stringify(user));
    toast.success("Profile updated");
  };

  const logout = () => {
    localStorage.removeItem("ncrt_user");
    navigate("/signin");
  };

  const changeLang = (selectedLang: string) => {
    setLang(selectedLang);
    localStorage.setItem("ncrt_lang", selectedLang);
    toast.success(`Language changed to ${selectedLang}`);
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
          <h1 className="text-white font-bold text-lg">Settings</h1>
        </div>
        <button
          type="button"
          data-ocid="settings.toggle"
          onClick={logout}
          className="text-white flex items-center gap-1 text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        {["profile", "language", "barcode"].map((t) => (
          <button
            key={t}
            type="button"
            data-ocid="settings.tab"
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${
              tab === t
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {t === "profile"
              ? "\u{1F464} Profile"
              : t === "language"
                ? "\u{1F310} Language"
                : "\u{1F4F1} Barcode"}
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
              Full Name
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
              Phone
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
              Address
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
              City
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
            Save Changes
          </button>
        </div>
      )}

      {/* Language Tab */}
      {tab === "language" && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <p className="text-sm font-bold text-gray-800 mb-3">
              Quick Language Switch
            </p>
            <div className="flex gap-3">
              {["English", "Hindi"].map((l) => (
                <button
                  key={l}
                  type="button"
                  data-ocid="settings.toggle"
                  onClick={() => changeLang(l)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    lang === l
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {l === "English"
                    ? "\u{1F1EC}\u{1F1E7} English"
                    : "\u{1F1EE}\u{1F1F3} Hindi"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-sm font-bold text-gray-800 mb-3">
              All Languages
            </p>
            <div className="space-y-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  data-ocid="settings.tab"
                  onClick={() => changeLang(l)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                    lang === l
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{l}</span>
                  {lang === l && <span className="text-green-600">✓</span>}
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
            <p className="text-sm font-bold text-gray-800 mb-4">Share App</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`}
              alt="QR Code"
              className="w-48 h-48"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <p className="text-xs text-gray-500 mt-4 text-center">
              Scan to open NEW C.R. TRADERS app
            </p>
            <p className="text-xs text-gray-400 mt-1 text-center break-all">
              {appUrl}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Shop Details
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

      <BottomNav />
    </div>
  );
}
