"use client";

import "./footer.css";
import { useTranslation } from "react-i18next";

export default function FooterComponent() {
  const { t } = useTranslation("footer");

  return (
    <footer className="footer">
      <p>© 2025 AgriChain. {t("rights")}</p>
      <nav className="footer-links">
        <a href="#">{t("privacy")}</a>
        <a href="#">{t("terms")}</a>
        <a href="#">{t("contact")}</a>
      </nav>
    </footer>
  );
}
