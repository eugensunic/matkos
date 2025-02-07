import { Box, CircularProgress } from "@mui/material";
import React, { useEffect, useContext } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { getToken, onMessage } from "firebase/messaging";
import { initialize, isFirebaseSupported } from "./firebase";
import ConfigurableValues from "./config/constants";
import Checkout from "./screens/Checkout/Checkout";
import EmailSent from "./screens/EmailSent/EmailSent";
import Favourites from "./screens/Favourites/Favourites";
import ForgotPassword from "./screens/ForgotPassword/ForgotPassword";
import Login from "./screens/Login/Login";
import LoginEmail from "./screens/LoginEmail/LoginEmail";
import MyOrders from "./screens/MyOrders/MyOrders";
import NewLogin from "./screens/NewLogin/NewLogin";
import OrderDetail from "./screens/OrderDetail/OrderDetail";
import Paypal from "./screens/Paypal/Paypal";
import Privacy from "./screens/Privacy/Privacy";
import Profile from "./screens/Profile/Profile";
import Settings from "./screens/Settings/Settings";
import Registration from "./screens/Registration/Registration";
import PhoneNumber from "./screens/PhoneNumber/PhoneNumber";
import VerifyEmail from "./screens/VerifyEmail/VerifyEmail";
import VerifyForgotOtp from "./screens/VerifyForgotOtp/VerifyForgotOtp";
import ResetPassword from "./screens/ResetPassword/ResetPassword";
import RestaurantDetail from "./screens/RestaurantDetail/RestaurantDetail";
import Restaurants from "./screens/Restaurants/Restaurants";
import Stripe from "./screens/Stripe/Stripe";
import Terms from "./screens/Terms/Terms";
import FlashMessage from "./components/FlashMessage";
import Pickup from "./screens/Pickup/Pickup";
import * as Sentry from "@sentry/react";
import AuthRoute from "./routes/AuthRoute";
import PrivateRoute from "./routes/PrivateRoute";
import VerifyPhone from "./screens/VerifyPhone/VerifyPhone";
import UserContext from "./context/User";
import { useTranslation } from "../node_modules/react-i18next";

function App() {
  const { VAPID_KEY, SENTRY_DSN } = ConfigurableValues();
  const { isLoggedIn } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const loadGoogleMapsScript = (apiKey) => {
    if (!document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`)) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  };

  useEffect(() => {
    const apiKey = "AIzaSyAphmsPaouvviENlu4RRoUitsRWDV3NQIU";
    loadGoogleMapsScript(apiKey);
  }, []);

  useEffect(() => {
    // const initializeFirebase = async () => {
    //   if (await isFirebaseSupported()) {
    //     const messaging = initialize();
    //     Notification.requestPermission()
    //       .then(() => {
    //         getToken(messaging, {
    //           vapidKey: VAPID_KEY,
    //         })
    //           .then((token) => {
    //             localStorage.setItem("messaging-token", token);
    //           })
    //           .catch((err) => {
    //             console.log("getToken error", err);
    //           });
    //       })
    //       .catch(console.log);

    //     onMessage(messaging, function (payload) {
    //       const { title, body } = payload.notification;
    //       console.log("Notification received:", title, body);
    //     });
    //   }
    // };
    // initializeFirebase();

    if (SENTRY_DSN) {
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: "development",
        enableInExpoDevelopment: true,
        debug: true,
        tracesSampleRate: 1.0, // Adjust for production
      });
    }
  }, [VAPID_KEY, SENTRY_DSN]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/restaurant-list" replace />} />
        <Route path="/restaurant-list" element={<Restaurants />} />
        <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/pickup" element={<Pickup />} />
        <Route
          path={"/login"}
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path={"/registration"}
          element={
            <AuthRoute>
              <Registration />
            </AuthRoute>
          }
        />
        <Route
          path={"/new-login"}
          element={
            <AuthRoute>
              <NewLogin />
            </AuthRoute>
          }
        />
        <Route
          path={"/login-email"}
          element={
            <AuthRoute>
              <LoginEmail />
            </AuthRoute>
          }
        />
        <Route
          path={"/verify-email"}
          element={
            <AuthRoute>
              <VerifyEmail />
            </AuthRoute>
          }
        />
        <Route
          path={"/new-password"}
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />
        <Route
          path={"/phone-number"}
          element={
            <PrivateRoute>
              <PhoneNumber />
            </PrivateRoute>
          }
        />
        <Route
          path={"/verify-phone"}
          element={
            <PrivateRoute>
              <VerifyPhone />
            </PrivateRoute>
          }
        />
        <Route
          path={"/forgot-password"}
          element={
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          }
        />
        <Route
          path={"/verify-forgot-otp"}
          element={
            <AuthRoute>
              <VerifyForgotOtp />
            </AuthRoute>
          }
        />
        <Route
          path={"/email-sent"}
          element={
            <AuthRoute>
              <EmailSent />
            </AuthRoute>
          }
        />
        <Route
          path={"/orders"}
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />
        <Route
          path={"/profile"}
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path={"/settings"}
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path={"/checkout"}
          element={isLoggedIn ? <Checkout /> : <Login />}
        />
        <Route
          path={"/order-detail/:id"}
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />
        <Route
          path={"/paypal"}
          element={
            <PrivateRoute>
              <Paypal />
            </PrivateRoute>
          }
        />
        <Route
          path={"/stripe"}
          element={
            <PrivateRoute>
              <Stripe />
            </PrivateRoute>
          }
        />
        <Route
          path={"/favourite"}
          element={
            <PrivateRoute>
              <Favourites />
            </PrivateRoute>
          }
        />
      </Routes>
      <FlashMessage severity="info" alertMessage="" open={false} />
    </HashRouter>
  );
}

export default Sentry.withProfiler(App);
