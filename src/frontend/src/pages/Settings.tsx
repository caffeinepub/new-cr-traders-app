import { ArrowLeft, LogOut } from "lucide-react";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";

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
  const [lang, setLang] = useState("Hindi");
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

  return (
    <div className="pb-20">
      <div className="bg-green-600 px-4 pt-10 pb-4 flex items-center justify-between">
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
          data-ocid="settings.logout_button"
          onClick={logout}
          className="text-white flex items-center gap-1 text-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        {["profile", "language", "barcode", "about"].map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`settings.${t}.tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-xs font-semibold capitalize transition ${tab === t ? "border-b-2 border-green-600 text-green-700" : "text-gray-500"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        {tab === "profile" && (
          <div className="space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            {["fullName", "email", "phone", "address", "city", "state"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    data-ocid={`settings.${field}_input`}
                    type="text"
                    value={user[field] || ""}
                    onChange={(e) =>
                      setUser((p: typeof user) => ({
                        ...p,
                        [field]: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ),
            )}
            <button
              type="button"
              data-ocid="settings.save_button"
              onClick={saveProfile}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mt-2"
            >
              Save Profile
            </button>
          </div>
        )}

        {tab === "language" && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-3">
              Select your preferred language
            </p>
            {LANGUAGES.map((l) => (
              <button
                type="button"
                key={l}
                data-ocid={`settings.language.${l.toLowerCase()}.button`}
                onClick={() => {
                  setLang(l);
                  toast.success(`Language set to ${l}`);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition ${lang === l ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {tab === "barcode" && (
          <div className="flex flex-col items-center py-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Scan to share the app
            </p>
            <div className="p-4 bg-white rounded-2xl shadow-md">
              <QRCode
                value="NEW C.R. TRADERS Grocery App - Mahavir Ganj, Aligarh 202001 - Contact: 9358251328"
                size={220}
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Share this QR code with friends and family
            </p>
            <p className="text-xs text-green-700 font-semibold mt-2">
              NEW C.R. TRADERS
            </p>
          </div>
        )}

        {tab === "about" && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-2xl p-4">
              <p className="font-bold text-green-800 text-sm mb-2">
                🛒 NEW C.R. TRADERS
              </p>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                Har rasoi ka zaruri samaan,
                <br />
                Shuddh quality aur sahi daam.
                <br />
                Masale, rashan aur dry fruits ki shaan,
                <br />
                Har ghar ka hum par hai vishwas tamaam.
                <br />
                <br />
                Shaadi, party aur function ka bhi mile samaan,
                <br />
                Har khushi ke mauke par yaad aaye ek hi naam –<br />
                NEW CR TRADERS ka bharosemand kaam.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700">📍 Address</p>
              <p className="text-xs text-gray-600">
                Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas
              </p>
              <p className="text-xs text-gray-600">
                Aligarh – 202001, Uttar Pradesh
              </p>
              <p className="text-xs text-gray-600 mt-2">📞 9358251328</p>
              <p className="text-xs text-gray-600">GSTIN: 09BTFPK1482H1ZK</p>
              <p className="text-xs text-gray-600">FSSAI: 22727411000024</p>
              <p className="text-xs text-gray-500 mt-2">
                Owner: Vinod Kumar Varshney & Yatish Kumar Varshney
              </p>
            </div>
            <button
              type="button"
              data-ocid="settings.admin_link"
              onClick={() => navigate("/admin")}
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium"
            >
              Admin Login
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
