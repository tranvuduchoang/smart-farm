"use client";

import "./header.css";
import { Button } from "../ui/button/button";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n";

export default function HeaderComponent() {
  const { t } = useTranslation("header");
  const currentLang = i18n.language as "vi" | "en";
  const nextLang = currentLang === "vi" ? "en" : "vi";

  const handleLanguageSwitch = () => {
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="header">
      <div className="logo">AgriChain</div>
      <nav className="nav">
        <a href="/">{t("home")}</a>
        <a href="#">{t("marketplace")}</a>
        <a href="#">{t("suppliers")}</a>
        <a href="#">{t("about")}</a>
      </nav>
      <div className="actions">
        <Button className="auth-split-button">
          <Link href="/auth?mode=register" className="left-half">{t("signup")}</Link>
          <Link href="/auth?mode=login" className="right-half">{t("login")}</Link>
        </Button>

        {/* Language Switch */}
        <div className="lang-switch" onClick={handleLanguageSwitch}>
          <Image
            src={nextLang === "vi" ? "/flags/vn.png" : "/flags/us.png"}
            alt={nextLang === "vi" ? "Tiếng Việt" : "English"}
            width={24}
            height={24}
            className="flag-icon"
          />
        </div>
      </div>
    </header>
  );
}
