"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enHeader from "../public/locales/en/header.json";
import viHeader from "../public/locales/vi/header.json";
import enFooter from "../public/locales/en/footer.json";
import viFooter from "../public/locales/vi/footer.json";
import enLanding from "../public/locales/en/landing.json";
import viLanding from "../public/locales/vi/landing.json";
import enProductDetail from "../public/locales/en/productDetail.json";
import viProductDetail from "../public/locales/vi/productDetail.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        header: enHeader,
        footer: enFooter,
        landing: enLanding,
        productDetail: enProductDetail
      },
      vi: {
        header: viHeader,
        footer: viFooter,
        landing: viLanding,
        productDetail: viProductDetail
      },
    },
    lng: "en",
    fallbackLng: "en",
    ns: ["header", "footer", "landing", "productDetail"], // 👈 khai báo danh sách namespace
    defaultNS: "header",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
