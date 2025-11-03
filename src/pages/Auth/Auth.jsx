/* eslint-disable no-unused-vars */
import "./Auth.css";
import { Button } from "@/components/ui/button";
import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ForgotPasswordForm from "./ForgotPassword";
import { useSelector } from "react-redux";
import CustomeToast from "@/components/custome/CustomeToast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md relative">
        {/* Toast */}
        <CustomeToast show={auth.error} message={auth.error?.error} />

        {/* Title */}
        <h1 className="text-center mb-8">
          <span className="font-bold text-4xl text-orange-600">Market</span>
          <span className="text-gray-800 text-4xl font-semibold">Dock</span>
        </h1>

        {/* Auth Form Section */}
        {location.pathname === "/signup" ? (
          <section className="w-full">
            <div className="space-y-6">
              <SignupForm />
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
          <section className="w-full">
            <div className="space-y-6">
              <LoginForm />

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
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Auth;
