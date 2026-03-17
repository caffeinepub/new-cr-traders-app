import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "../lib/router";

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      aria-label="Show password"
    >
      <title>Show password</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      aria-label="Hide password"
    >
      <title>Hide password</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
}

type ForgotStep = "input" | "otp" | "reset";

export default function SignIn() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("input");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [foundUser, setFoundUser] = useState<{
    phone: string;
    email: string;
    password: string;
    name?: string;
  } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const user = users.find(
      (u: { phone: string; email: string; password: string }) =>
        u.phone === phone && u.email === email && u.password === password,
    );
    if (user) {
      localStorage.setItem("ncrt_user", JSON.stringify(user));
      navigate("/home");
    } else {
      toast.error("Invalid phone number, email or password.");
      setLoading(false);
    }
  };

  const handleForgotSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const user = users.find(
      (u: { phone: string; email: string }) =>
        u.phone === forgotPhone && u.email === forgotEmail,
    );
    if (!user) {
      toast.error("No account found with this phone number and email.");
      return;
    }
    setFoundUser(user);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setForgotStep("otp");
    toast.info(`Your OTP is: ${otp}`, { duration: 30000 });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp) {
      setForgotStep("reset");
    } else {
      toast.error("Incorrect OTP. Please try again.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("ncrt_users") || "[]");
    const updated = users.map((u: { phone: string; email: string }) =>
      u.phone === foundUser?.phone && u.email === foundUser?.email
        ? { ...u, password: newPassword }
        : u,
    );
    localStorage.setItem("ncrt_users", JSON.stringify(updated));
    toast.success("Password reset successfully! Please sign in.");
    setShowForgot(false);
    setForgotStep("input");
    setForgotPhone("");
    setForgotEmail("");
    setEnteredOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (showForgot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-green-800">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {forgotStep === "input" &&
                  "Enter your registered phone & email"}
                {forgotStep === "otp" &&
                  "Enter the OTP shown in the notification"}
                {forgotStep === "reset" && "Set your new password"}
              </p>
            </div>

            {forgotStep === "input" && (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="forgot-phone"
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                    placeholder="Registered phone number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                    placeholder="Registered email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm"
                >
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-gray-500 py-2 text-sm"
                >
                  Back to Sign In
                </button>
              </form>
            )}

            {forgotStep === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-yellow-700 font-medium">
                    OTP sent! Check the notification above.
                  </p>
                  <p className="text-lg font-bold text-yellow-800 mt-1 tracking-widest">
                    {generatedOtp}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="forgot-otp"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter OTP
                  </label>
                  <input
                    id="forgot-otp"
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 text-center tracking-widest text-lg"
                    placeholder="6-digit OTP"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm"
                >
                  Verify OTP
                </button>
                <button
                  type="button"
                  onClick={() => setForgotStep("input")}
                  className="w-full text-gray-500 py-2 text-sm"
                >
                  Back
                </button>
              </form>
            )}

            {forgotStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-newpw"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="forgot-newpw"
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-green-500"
                      placeholder="New password (min 6 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="forgot-confirmpw"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="forgot-confirmpw"
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold text-sm"
                >
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

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
                htmlFor="signin-phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="signin-phone"
                data-ocid="signin.input"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label
                htmlFor="signin-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="signin-email"
                data-ocid="signin.email_input"
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
              <div className="relative">
                <input
                  id="signin-password"
                  data-ocid="signin.password_input"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotStep("input");
                  }}
                  className="text-xs text-green-600 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
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
