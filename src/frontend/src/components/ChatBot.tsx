import { MessageCircle, RefreshCw, Send, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, PRODUCTS } from "../data/products";

const SHOP = {
  name: "NEW C.R. TRADERS",
  address:
    "Mahavir Ganj, Muchoon Wale Hanuman Ji ke paas, Aligarh – 202001, UP",
  whatsapp: "9358251328",
  customerCare: "9358351328",
  gstin: "09BTFPK1482H1ZK",
  fssai: "22727411000024",
  timings: "Subah 8 baje se raat 9 baje tak, Somvar se Ravivar",
  timingsEn: "8 AM – 9 PM, Monday to Sunday",
};

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  products?: Array<{
    name: string;
    price: number;
    size: string;
    isPacked: boolean;
    isAvailable: boolean;
  }>;
  isTyping?: boolean;
}

const QUICK_REPLIES = [
  { label: "🛒 Products", query: "products kya hain" },
  { label: "📦 Order Karo", query: "order kaise karu" },
  { label: "🏪 Shop Info", query: "shop ki jankari" },
  { label: "↩️ Returns", query: "return policy" },
];

function detectLang(text: string): "hi" | "en" {
  // Simple heuristic: if common Hindi/Hinglish words found, reply in Hindi
  const hindiWords =
    /\b(kya|kaise|kitna|kitne|hai|hain|ka|ki|ke|mujhe|mein|nahi|aur|bhi|yeh|woh|kahan|kab|karo|chahiye|btao|batao|dikhao|dalo|lena|lelo|milta|milti|price|daam|paisa|rupees|rupaye|krlo|krna|kru|bata|dena|dedo|dogi|kaha|hoga|hogi|krta|krte|iska|unka|sab|saari|poora|poori|dal|masala|masale|namak|chawal|chana|moong|arhar|urad|rajma|badam|kaju|pista|jeera|haldi|mirch|dhaniya|laung|dalchini|elaichi|saunf|ajwain|rai|methi|kesar|sabudana|kuttu|singhada|kishmish|anjeer|khajoor|chini|boora|besan|sooji|tea|chai|agarbatti|dhoop|kapoor|puja|hawan|roli|mouli|janeu|gulal|rice|chawal|goldiee|hing|kasoori)\b/i;
  return hindiWords.test(text) ? "hi" : "en";
}

function searchProducts(query: string) {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryId.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q),
  ).slice(0, 8);
}

function getCategoryProducts(catId: string) {
  return PRODUCTS.filter((p) => p.categoryId === catId).slice(0, 10);
}

function generateResponse(userText: string): {
  text: string;
  products?: Message["products"];
} {
  const lang = detectLang(userText);
  const q = userText.toLowerCase().trim();

  const hi = lang === "hi";

  // --- GREETINGS ---
  if (
    /^(hi|hello|helo|hey|namaste|namaskar|jai|sat sri|waheguru|ram ram|jai shri|pranam|good morning|good evening|good afternoon|salam|adaab)/.test(
      q,
    )
  ) {
    return {
      text: hi
        ? "Namaskar! 🙏 NEW C.R. TRADERS mein aapka swagat hai!\n\nMain aapki kaise madad kar sakta hun? Aap product search kar sakte hain, daam pooch sakte hain, ya order karne ka tarika jaan sakte hain."
        : "Hello! 🙏 Welcome to NEW C.R. TRADERS!\n\nHow can I help you today? You can search products, ask about prices, or learn how to place an order.",
    };
  }

  // --- ORDER HOW ---
  if (
    /(order|kharid|buy|purchase|karo|kaise|how to order|place order)/.test(q)
  ) {
    return {
      text: hi
        ? `Order karne ka tarika:\n\n1. Jo saman chahiye usse cart mein daalo\n2. Cart mein jaao (neeche navigation se)\n3. WhatsApp button dabao\n4. Order direct hamari shop par bheja jayega\n\n📱 WhatsApp: ${SHOP.whatsapp}\n\n⚠️ Yeh pickup only shop hai — delivery nahi hoti. Aapko saman Mahavir Ganj, Aligarh se lena hoga.`
        : `How to Order:\n\n1. Add items to your cart\n2. Go to Cart (bottom navigation)\n3. Tap WhatsApp Order button\n4. Your order goes directly to our shop\n\n📱 WhatsApp: ${SHOP.whatsapp}\n\n⚠️ Pickup only — no delivery. You must collect from Mahavir Ganj, Aligarh.`,
    };
  }

  // --- SHOP INFO ---
  if (
    /(shop|address|location|kahan|where|timing|time|khulta|band|open|close|jankari|info)/.test(
      q,
    )
  ) {
    return {
      text: hi
        ? `🏪 NEW C.R. TRADERS\n\n📍 Pata: ${SHOP.address}\n\n⏰ Samay: ${SHOP.timings}\n\n📞 Customer Care: ${SHOP.customerCare}\n📱 WhatsApp Order: ${SHOP.whatsapp}\n\n🚫 Sirf Pickup — koi delivery nahi`
        : `🏪 NEW C.R. TRADERS\n\n📍 Address: ${SHOP.address}\n\n⏰ Timings: ${SHOP.timingsEn}\n\n📞 Customer Care: ${SHOP.customerCare}\n📱 WhatsApp Order: ${SHOP.whatsapp}\n\n🚫 Pickup Only — No Delivery`,
    };
  }

  // --- RETURN POLICY ---
  if (
    /(return|refund|wapas|exchange|replace|quality|problem|issue|kharab|damage)/.test(
      q,
    )
  ) {
    return {
      text: hi
        ? `↩️ Return & Refund Policy:\n\n✅ Packed product agar sealed band ho aur quality problem ho toh 3 din mein wapas laa sakte hain\n✅ Unpacked masale/dal mein quality issue ho toh same din wapas karein\n❌ Khule/istemal kiye saman ki wapasi nahi hogi\n\n📞 Customer Care: ${SHOP.customerCare}`
        : `↩️ Return & Refund Policy:\n\n✅ Packed sealed products can be returned within 3 days if quality issue\n✅ Unpacked dal/masala quality issues must be raised on same day\n❌ Opened or used items cannot be returned\n\n📞 Customer Care: ${SHOP.customerCare}`,
    };
  }

  // --- GSTIN / FSSAI / LEGAL ---
  if (/(gstin|gst|fssai|license|legal|registration|number|no\.)/.test(q)) {
    return {
      text: `📋 Legal Information:\n\n🏛️ GSTIN: ${SHOP.gstin}\n🍃 FSSAI: ${SHOP.fssai}\n\nNEW C.R. TRADERS is a fully registered vegetarian grocery shop.`,
    };
  }

  // --- DELIVERY ---
  if (/(delivery|ghar|home|deliver|bhejo|bhejdo|lao|courier)/.test(q)) {
    return {
      text: hi
        ? `🚫 Maafi chahte hain! Hamari shop mein abhi ghar delivery nahi hoti.\n\nAap Mahavir Ganj, Aligarh aakar saman le sakte hain.\n\n📍 ${SHOP.address}\n⏰ ${SHOP.timings}`
        : `🚫 Sorry! We do not offer home delivery at this time.\n\nYou can pick up your order from our shop:\n📍 ${SHOP.address}\n⏰ ${SHOP.timingsEn}`,
    };
  }

  // --- CATEGORY LISTING ---
  const catMap: Record<string, string[]> = {
    dal: [
      "dal",
      "chana",
      "moong",
      "urad",
      "arhar",
      "masoor",
      "lobia",
      "rajma",
      "kulthi",
      "sabut",
    ],
    masale: [
      "masale",
      "spice",
      "masala",
      "haldi",
      "mirch",
      "jeera",
      "dhaniya",
      "laung",
      "dalchini",
      "elaichi",
      "tej patta",
      "kalonji",
      "ajwain",
      "saunf",
      "rai",
      "methi",
      "kesar",
      "kali mirch",
      "javitri",
      "jaiphal",
    ],
    namak: ["namak", "salt", "sendha", "kala namak", "lahori"],
    pooja: [
      "puja",
      "pooja",
      "hawan",
      "agarbatti",
      "dhoop",
      "kapoor",
      "roli",
      "mouli",
      "janeu",
      "supari",
      "guggal",
      "loban",
      "akshat",
      "mishri",
      "batasha",
      "itra",
      "attar",
      "sehad",
      "honey",
      "til",
      "indra jau",
      "panchmeva",
    ],
    vrat: [
      "vrat",
      "sabudana",
      "sama",
      "kuttu",
      "singhada",
      "pumpkin",
      "chia",
      "magaj",
      "seeds",
    ],
    meva: [
      "meva",
      "dry fruit",
      "badam",
      "kaju",
      "pista",
      "akhrot",
      "kishmish",
      "munakka",
      "anjeer",
      "chironji",
      "khajoor",
      "nariyal",
      "coconut",
      "golla",
    ],
    grocery: [
      "grocery",
      "chini",
      "sugar",
      "boora",
      "besan",
      "sooji",
      "ararot",
      "cornflour",
      "baking",
      "soda",
    ],
    dye: ["dye", "rang", "fabric", "colour", "color", "kapda", "cloth"],
    rice: ["rice", "chawal", "unity", "india gate", "galaxy", "double chabi"],
    goldiee: ["goldiee", "goldi", "hing", "asafoetida", "kasoori methi"],
    tea: ["tea", "chai", "patti", "mohini", "tazza", "tata"],
  };

  for (const [catId, keywords] of Object.entries(catMap)) {
    const matched = keywords.some((kw) => q.includes(kw));
    // Check if it looks like a category listing query
    const isListQuery =
      /(kya kya|kaun|list|sab|saare|dikhao|show|available|kya hai|kaunse|kya milta|hain kya)/.test(
        q,
      );
    if (matched && isListQuery) {
      const catProducts = getCategoryProducts(catId);
      const cat = CATEGORIES.find((c) => c.id === catId);
      return {
        text: hi
          ? `${cat?.emoji} ${cat?.name} mein ye sab milta hai:`
          : `${cat?.emoji} Available in ${cat?.name}:`,
        products: catProducts.map((p) => ({
          name: p.name,
          price: p.price,
          size: p.size,
          isPacked: p.isPacked,
          isAvailable: p.isAvailable,
        })),
      };
    }
  }

  // --- PRODUCT PRICE / SEARCH ---
  // Extract possible product keyword
  const cleanQ = q
    .replace(
      /(price|daam|kitna|kitne|ka|ki|ke|hai|hain|kya|batao|bata|price|cost|rupaye|rupees|rs|₹|of|the|is|how much|kya h|milta|milti)\s*/gi,
      " ",
    )
    .trim();

  if (cleanQ.length > 1) {
    const results = searchProducts(cleanQ);
    if (results.length > 0) {
      return {
        text: hi
          ? `"${cleanQ}" ke liye ${results.length} product${results.length > 1 ? " mile" : " mila"}:`
          : `Found ${results.length} product${results.length > 1 ? "s" : ""} for "${cleanQ}":`,
        products: results.map((p) => ({
          name: p.name,
          price: p.price,
          size: p.size,
          isPacked: p.isPacked,
          isAvailable: p.isAvailable,
        })),
      };
    }
  }

  // --- ALL CATEGORIES ---
  if (
    /(product|category|categories|sab|saara|milta|milti|kya kya|list|sab kuch|stock|available)/.test(
      q,
    )
  ) {
    const catList = CATEGORIES.map((c) => `${c.emoji} ${c.name}`).join("\n");
    return {
      text: hi
        ? `Hamare yahan ye 11 categories mein saman milta hai:\n\n${catList}\n\nKisi category ka naam type karein ya product search karein.`
        : `We have products in 11 categories:\n\n${catList}\n\nType a category name or search for a product.`,
    };
  }

  // --- FALLBACK ---
  return {
    text: hi
      ? "Mujhe samajh nahi aaya. 😊 Aap ye pooch sakte hain:\n\n• Koi product ka naam (jaise: badam, jeera, toor dal)\n• Category (jaise: dal kya kya hai, masale list)\n• Order karne ka tarika\n• Shop ki jankari\n• Return policy"
      : "I didn't quite understand. 😊 You can ask me:\n\n• A product name (e.g. badam, jeera, toor dal)\n• Category list (e.g. what dals do you have)\n• How to place an order\n• Shop info `I didn't quite understand. 😊 You can ask me:\n\n• A product name (e.g. badam, jeera, toor dal)\n• Category list (e.g. what dals do you have)\n• How to place an order\n• Shop info & timings\n• Return policy` timings\n• Return policy",
  };
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Namaskar! 🙏 NEW C.R. TRADERS mein aapka swagat hai!\n\nMain aapki poori madad karta hun — products, prices, order, sab kuch poochh sakte hain.",
    },
  ]);
  const [typing, setTyping] = useState(false);
  const msgIdRef = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll triggered by new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: msgIdRef.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const { text: botText, products } = generateResponse(text);
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: msgIdRef.current++, role: "bot", text: botText, products },
      ]);
    }, 400);
  };

  const clearChat = () => {
    msgIdRef.current = 1;
    setMessages([
      {
        id: 0,
        role: "bot",
        text: "Namaskar! 🙏 Main aapki kaise madad kar sakta hun?",
      },
    ]);
  };

  return (
    <>
      {/* FAB button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            data-ocid="chatbot.button"
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <MessageCircle className="text-white" size={26} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            data-ocid="chatbot.dialog"
            className="fixed bottom-20 right-2 left-2 sm:left-auto sm:w-[370px] z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxHeight: "75vh" }}
          >
            {/* Header */}
            <div className="bg-green-700 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                NCR
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  NEW C.R. TRADERS
                </p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full" />
                  <span className="text-green-200 text-xs">Online</span>
                </div>
              </div>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-green-600 text-green-200 hover:text-white transition-colors"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-green-600 text-green-200 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-green-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </p>

                    {/* Product cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.products.map((p, i) => (
                          <div
                            key={`product-${msg.id}-${i}`}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-800 text-xs leading-tight truncate">
                                {p.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {p.size} · {p.isPacked ? "Packed" : "Unpacked"}
                              </p>
                            </div>
                            <div className="ml-2 text-right flex-shrink-0">
                              <p className="font-bold text-green-700 text-sm">
                                ₹{p.price}
                              </p>
                              <p
                                className={`text-xs ${p.isAvailable ? "text-green-500" : "text-red-400"}`}
                              >
                                {p.isAvailable ? "✓ Available" : "Unavailable"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={`dot-${i}`}
                          className="w-2 h-2 bg-gray-400 rounded-full block"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 0.8,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick replies (show only if first message) */}
              {messages.length === 1 && !typing && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.label}
                      type="button"
                      data-ocid="chatbot.button"
                      onClick={() => sendMessage(qr.query)}
                      className="bg-white border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full shadow-sm hover:bg-green-50 transition-colors font-medium"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex items-center gap-2">
              <input
                ref={inputRef}
                data-ocid="chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Kuch bhi poochho..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="button"
                data-ocid="chatbot.primary_button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center disabled:opacity-40 transition-opacity flex-shrink-0"
              >
                <Send size={16} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
