"use client";

import "./header.css";
import { Button } from "../ui/button/button";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useSession, signOut } from "next-auth/react";
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { RxAvatar } from "react-icons/rx";

import i18n from "@/i18n";

export default function HeaderComponent() {
  const { t } = useTranslation("header");
  const currentLang = i18n.language as "vi" | "en";
  const nextLang = currentLang === "vi" ? "en" : "vi";
  const { data: session } = useSession();

  const handleLanguageSwitch = () => {
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  // Menu items for Dropdown
  const items: MenuProps['items'] = [
    {
      key: "1",
      label: <Link href="/account">{t("accountDetail")}</Link>,
    },
    {
      key: "2",
      label: <Link href="/cart">{t("yourCart")}</Link>,
    },
    // Conditionally render menu options based on user role
    ...(session?.user?.role === "NORMAL_USER"
      ? [
        {
          key: "3",
          label: <Link href="/shop/create">{t("createYourOwnShop")}</Link>, // "Create your own shop" for normal users
        },
      ]
      : []),
    ...(session?.user?.role === "SELLER"
      ? [
        {
          key: "4",
          label: <Link href="/shop">{t("goToYourShop")}</Link>, // "Go to your shop" for sellers
        },
      ]
      : []),
    {
      type: 'divider',
    },
    {
      key: "5",
      label: <span onClick={handleLogout}>{t("logout")}</span>,
      danger: true
    },
  ];

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
        {session?.user ? (
          <div className="avatar-menu">
            <Dropdown menu={{ items }} trigger={['click']}>
              {session.user.image ? (
                <img
                  src={session.user.image}
                  className="avatar"
                  alt="User Avatar"
                />
              ) : (
                <RxAvatar className="avatar" />
              )}
            </Dropdown>
          </div>
        ) : (
          <Button className="auth-split-button">
            <Link href="/auth?mode=register" className="left-half">{t("signup")}</Link>
            <Link href="/auth?mode=login" className="right-half">{t("login")}</Link>
          </Button>
        )}

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
