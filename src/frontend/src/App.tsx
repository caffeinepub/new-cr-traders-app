import { Toaster } from "./components/ui/sonner";
import { AppProvider } from "./contexts/AppContext";
import { BrowserRouter, Navigate, Route, Routes } from "./lib/router";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Cart from "./pages/Cart";
import CategoryPage from "./pages/CategoryPage";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = !!localStorage.getItem("ncrt_user");
  return isLoggedIn ? <>{children}</> : <Navigate to="/signin" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex justify-center bg-gray-100 min-h-screen">
          <div className="w-full max-w-md bg-white min-h-screen relative">
            <Routes>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/category/:id"
                element={
                  <PrivateRoute>
                    <CategoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <PrivateRoute>
                    <ProductDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order-success"
                element={
                  <PrivateRoute>
                    <OrderSuccess />
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route
                path="*"
                element={
                  <Navigate
                    to={localStorage.getItem("ncrt_user") ? "/home" : "/signin"}
                    replace
                  />
                }
              />
            </Routes>
          </div>
        </div>
        <Toaster />
      </BrowserRouter>
    </AppProvider>
  );
}
