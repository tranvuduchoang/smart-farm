"use client";

import "./auth.css";
import { FaFacebookF, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState("login");

  useEffect(() => {
    const m = searchParams.get("mode") || "login";
    setMode(m);
  }, [searchParams]);

  const isLogin = mode === "login";

  const toggleMode = () => {
    const newMode = isLogin ? "register" : "login";
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className={`auth-container slide-${mode}`}>
      {/* Left Panel: Login or Register Form */}
      <div className="auth-left">
        <h2 className="auth-title">
          {isLogin ? "Sign in to Account" : "Create an Account"}
        </h2>

        <div className="social-icons">
          <button><FaFacebookF color="blue"/></button>
          <button><FaLinkedinIn color="black"/></button>
          <button><FaGoogle color="red"/></button>
        </div>

        <p className="or-text">
          or use your email account
        </p>

        <input type="email" placeholder="Email" className="auth-input" />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-input"
          />
        )}

        {isLogin && (
          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot Password?</a>
          </div>
        )}

        <button className="auth-submit">
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <h2>{isLogin ? "Hello, Friend!" : "Welcome Back!"}</h2>
        <p>
          {isLogin
            ? "Fill up personal information and start journey with us."
            : "To keep connected with us please login with your personal info."}
        </p>
        <button onClick={toggleMode} className="auth-outline-btn">
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </div>
  );
}