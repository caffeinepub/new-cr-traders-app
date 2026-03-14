import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

interface Message {
  role: "bot" | "user";
  text: string;
}

const RESPONSES: [RegExp, string][] = [
  [
    /hello|hi|namaste/i,
    "Namaste! 🙏 Welcome to NEW C.R. TRADERS. How can I help you today?",
  ],
  [
    /dal|masale|rice|meva|dry fruit|oil|ghee|atta|flour|sugar|salt|pooja/i,
    "We have a great collection! Visit our categories: Dal, Masale, Meva, Rice, Pooja Items, Atta & Flour, Oil & Ghee, Sugar & Salt. 🛒",
  ],
  [
    /deliver|delivery|area|where/i,
    "We currently deliver ONLY within Aligarh city, Uttar Pradesh. 📍",
  ],
  [
    /price|rate|cost/i,
    "Our prices are very competitive. All prices include taxes and are displayed on each product page. 💰",
  ],
  [
    /contact|phone|number|call/i,
    "You can reach us at: 📞 9358251328 (WhatsApp available). We're located at Mahavir Ganj, Aligarh.",
  ],
  [
    /address|location|where.*shop/i,
    "📍 Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh - 202001, Uttar Pradesh",
  ],
  [/gstin|gst/i, "Our GSTIN is: 09BTFPK1482H1ZK"],
  [/fssai/i, "Our FSSAI License No. is: 22727411000024"],
  [
    /return|refund/i,
    "Damaged or wrong items can be returned within 24 hours. Contact us on WhatsApp: 9358251328 📱",
  ],
  [
    /order|buy|purchase/i,
    "To place an order: Browse products → Add to Cart → Checkout. Orders are confirmed via WhatsApp! ✅",
  ],
  [
    /time|hour|open|close/i,
    "We are open from 8 AM to 10 PM, Monday to Sunday. 🕐",
  ],
  [
    /thank|thanks|shukriya/i,
    "Thank you for choosing NEW C.R. TRADERS! We're happy to serve you. 🙏",
  ],
];

function getResponse(msg: string): string {
  for (const [pattern, response] of RESPONSES) {
    if (pattern.test(msg)) return response;
  }
  return "I'm not sure about that. Please call us at 9358251328 for help! 📞";
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Namaste! 🙏 I'm your NEW C.R. TRADERS assistant. Ask me about products, delivery, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      { role: "bot", text: getResponse(userMsg) },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-green-600 rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-green-700 transition"
      >
        <MessageCircle size={22} className="text-white" />
      </button>

      {/* Chat Modal */}
      {open && (
        <div
          data-ocid="chatbot.dialog"
          className="fixed bottom-20 right-4 w-72 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">AI Assistant</p>
              <p className="text-green-100 text-xs">NEW C.R. TRADERS</p>
            </div>
            <button
              type="button"
              data-ocid="chatbot.close_button"
              onClick={() => setOpen(false)}
            >
              <X size={18} className="text-white" />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${m.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-3 flex gap-2">
            <input
              data-ocid="chatbot.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="button"
              data-ocid="chatbot.submit_button"
              onClick={send}
              className="bg-green-600 text-white p-2 rounded-lg"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
