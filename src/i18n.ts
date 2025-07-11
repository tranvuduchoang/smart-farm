"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enHeader from "../src/locales/en/header.json";
import viHeader from "../src/locales/vi/header.json";
import enFooter from "../src/locales/en/footer.json";
import viFooter from "../src/locales/vi/footer.json";
import enLanding from "../src/locales/en/landing.json";
import viLanding from "../src/locales/vi/landing.json";
import enProductDetail from "../src/locales/en/productDetail.json";
import viProductDetail from "../src/locales/vi/productDetail.json";
import enAuth from "../src/locales/en/auth.json";
import viAuth from "../src/locales/vi/auth.json";
import enShop from "../src/locales/en/shop.json";
import viShop from "../src/locales/vi/shop.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        header: enHeader,
        footer: enFooter,
        landing: enLanding,
        productDetail: enProductDetail,
        auth: enAuth,
        shop: enShop
      },
      vi: {
        header: viHeader,
        footer: viFooter,
        landing: viLanding,
        productDetail: viProductDetail,
        auth: viAuth,
        shop: viShop
      },
    },
    lng: "en",
    fallbackLng: "en",
    ns: ["header", "footer", "landing", "productDetail", "auth", "shop"], // 👈 khai báo danh sách namespace
    defaultNS: "header",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
