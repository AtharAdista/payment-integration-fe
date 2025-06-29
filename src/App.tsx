import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Pricing from "./pages/pricing/pricing";
import Plus from "./pages/plus/plus";
import Pro from "./pages/pro/pro";
import Register from "./pages/auth/register/register";
import Login from "./pages/auth/login/login";
import Payment from "./pages/payment-method/payment";
import PaymentConfirmation from "./pages/payment-confirmation/paymentConfirmation";
import PaymentWaiting from "./pages/payment-waiting/paymentWaiting";
import ProtectedRoutePackage from "./components/common/guard/protectedRoutePackage";
import NoActiveSubscriptionRoute from "./components/common/guard/noActiveSubscriptionRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/authentication">
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route
        path="/pricing"
        element={
          <NoActiveSubscriptionRoute>
            <Pricing />
          </NoActiveSubscriptionRoute>
        }
      />
      <Route
        path="/pricing/:id/payment"
        element={
          <NoActiveSubscriptionRoute>
            <Payment />
          </NoActiveSubscriptionRoute>
        }
      />
      <Route
        path="/pricing/:id/payment/:xenditId"
        element={
          <NoActiveSubscriptionRoute>
            <PaymentConfirmation />
          </NoActiveSubscriptionRoute>
        }
      />
      <Route
        path="/pricing/:id/payment/:xenditId/status"
        element={
          <NoActiveSubscriptionRoute>
            <PaymentWaiting />
          </NoActiveSubscriptionRoute>
        }
      />

      <Route
        path="/plus"
        element={
          <ProtectedRoutePackage allowedPackages={["plus", "pro"]}>
            <Plus />
          </ProtectedRoutePackage>
        }
      />
      <Route
        path="/pro"
        element={
          <ProtectedRoutePackage allowedPackages={["pro"]}>
            <Pro />
          </ProtectedRoutePackage>
        }
      />

    </Routes>
  );
}

export default App;
