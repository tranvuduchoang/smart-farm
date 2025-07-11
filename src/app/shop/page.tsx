import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { getServerTranslation } from "@/lib/i18nServer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { headers } from "next/headers"; // chỉ sử dụng trong Server Component
import { redirect } from "next/navigation";
import { DeleteShopButton } from "@/components/shop/DeleteShopButton";
import DeleteProductButton from "@/components/shop/DeleteProductButton";
import NoShopMessage from "@/components/shop/NoShopMessage";
import "./shop.css";

export default async function ShopPage() {
  const headersList = await headers(); // ✅ Dùng await
  const lang = headersList.get("x-language") || "en"; // Lấy ngôn ngữ từ headers
  const { t } = await getServerTranslation("shop", lang);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth?mode=login");

  const shop = await prisma.shop.findUnique({
    where: { ownerId: session.user.id },
    include: { products: true },
  });

  if (!shop) {
    return (
      <NoShopMessage />
    );
  }

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="text-xl font-bold">
          {t("yourShop")}: {shop.name}
        </h1>
        <DeleteShopButton />
      </div>

      <p className="text-gray-600 mt-2">{shop.description || t("noDescription")}</p>

      <div className="mt-4">
        <Link href="/shop/edit" className="text-green-600 underline">
          📝 {t("editShop")}
        </Link>
      </div>

      <div className="shop-products">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{t("products")}</h2>
          <Link
            href="/shop/product/create"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            ➕ {t("addProduct")}
          </Link>
        </div>

        {shop.products.length === 0 ? (
          <p className="text-gray-500">{t("noProductYet")}</p>
        ) : (
          <ul className="space-y-3">
            {shop.products.map((product) => (
              <li key={product.id} className="shop-product-card">
                {product.name} {product.categoryId}
                <div className="flex gap-2">
                  <Link
                    href={`/shop/product/edit/${product.id}`}
                    className="text-blue-600 underline"
                  >
                    {t("edit")}
                  </Link>
                  <DeleteProductButton productId={product.id} confirmText={t("confirmDeleteProduct")} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
