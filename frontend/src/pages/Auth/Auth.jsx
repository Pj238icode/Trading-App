/* eslint-disable no-unused-vars */
import "./Auth.css";
import { Button } from "@/components/ui/button";
import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import LoginWithGoogle from "./LoginWithGoogle.";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import CustomeToast from "@/components/custome/CustomeToast";
import ForgotPasswordForm from "./ForgotPassword";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const { toast } = useToast();
  const [animate, setAnimate] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-700 bg-opacity-70"></div>

      <div className="relative z-50 flex flex-col justify-center items-center w-full max-w-md p-8 bg-gray-800 rounded-2xl shadow-2xl">
        {/* Toast for errors */}
        <CustomeToast show={auth.error} message={auth.error?.error} />

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
            alt="Market Dock Logo"
            className="w-24 h-24 mb-4"
          />
          <h1 className="text-4xl font-bold text-white">Market Dock</h1>
        </div>

        {/* Auth Forms */}
        {/* Auth Forms */}
        {location.pathname === "/signup" ? (
          <section className="w-full space-y-6">
            <SignupForm />

            {/* Remove Google Login Button on signup */}
            {/* <LoginWithGoogle /> */}

            <div className="flex justify-center items-center text-sm text-gray-600">
              <span>Already have an account?&nbsp;</span>
              <Button
                onClick={() => handleNavigation("/signin")}
                variant="ghost"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Button>
            </div>
          </section>
        ) : location.pathname === "/forgot-password" ? (
          <section className="w-full space-y-6">
            <ForgotPasswordForm />
            <div className="flex justify-center items-center text-sm text-gray-600">
              <span>Back to login?&nbsp;</span>
              <Button
                onClick={() => navigate("/signin")}
                variant="ghost"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Button>
            </div>
          </section>
        ) : (
          <section className="w-full space-y-6">
            <LoginForm />

            {/* Only show Google login button if NOT signup */}
            <LoginWithGoogle />

            <div className="flex justify-center items-center text-sm text-gray-600">
              <span>Don’t have an account?&nbsp;</span>
              <Button
                onClick={() => handleNavigation("/signup")}
                variant="ghost"
                className="text-blue-600 hover:underline"
              >
                Sign up
              </Button>
            </div>

            <div className="pt-3">
              <Button
                onClick={() => navigate("/forgot-password")}
                variant="outline"
                className="w-full py-4 border-gray-300 hover:bg-gray-50"
              >
                Forgot Password?
              </Button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Auth;
