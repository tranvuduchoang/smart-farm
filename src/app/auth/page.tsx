"use client";

import "./auth.css";
import { FaFacebookF, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function AuthForm() {
  const { t } = useTranslation("auth");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const m = searchParams.get("mode") || "login";
    setMode(m);
  }, [searchParams]);

  const isLogin = mode === "login";

  const toggleMode = () => {
    const newMode = isLogin ? "register" : "login";
    router.push(`/auth?mode=${newMode}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      if (password !== confirmPassword) {
        return setError(t("errorConfirmPass"));
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const msg = await res.json();
        setError(msg.error || "Registration failed");
        return;
      }

      // Tự động đăng nhập sau đăng ký
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });
    }

    if (mode === "login") {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(t("errorSignIn"));
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className={`auth-container slide-${mode}`}>
      {/* Left Panel: Login or Register Form */}
      <div className="auth-left">
        <h2 className="auth-title">
          {isLogin ? t("signInAccount") : t("creatAccount")}
        </h2>

        <div className="social-icons">
          <button><FaFacebookF color="blue" /></button>
          <button><FaLinkedinIn color="black" /></button>
          <button><FaGoogle color="red" /></button>
        </div>

        <p className="or-text">
          {t("useYourEmail")}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            placeholder="Email"
            className="auth-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder={t("password")}
              className="auth-input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>


          {!isLogin && (
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder={t("confirmPassword")}
                className="auth-input"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="toggle-eye"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
          )}

          {isLogin && (
            <div className="auth-options">
              <label>
                <input type="checkbox" /> {t("rememberMe")}
              </label>
              <a href="#">{t("forgotPassword")}</a>
            </div>
          )}

          <button className="auth-submit">
            {isLogin ? t("signIn") : t("signUp")}
          </button>
        </form>
      </div>


      {/* Right Panel */}
      <div className="auth-right">
        <h2>{isLogin ? t("helloFriend") : t("welcomeBack")}</h2>
        <p>
          {isLogin
            ? t("sloganSignUp")
            : t("sloganSignIn")}
        </p>
        <button onClick={toggleMode} className="auth-outline-btn">
          {isLogin ? t("signUp") : t("signIn")}
        </button>
        {error}
      </div>
    </div>
  );
}