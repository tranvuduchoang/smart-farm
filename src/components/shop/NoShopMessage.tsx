"use client";

import { useTranslation } from "react-i18next";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button/button";

export default function NoShopMessage() {
  const { t } = useTranslation("header");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="shop-container text-center">
      <p>Bạn vừa xóa cửa hàng cũ. Hãy đăng nhập lại để tạo cửa hàng mới</p>
      <Button onClick={handleLogout}>{t("logout")}</Button>
    </div>
  );
}
