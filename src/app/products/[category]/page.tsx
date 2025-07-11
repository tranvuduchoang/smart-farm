// src/app/products/[category]/page.tsx
import prisma from "@/lib/prisma";
import { getServerTranslation } from "@/lib/i18nServer";
import Link from "next/link";
import "./product-list.css";

export default async function ProductListPage({ params }: { params: { category: string } }) {
  const lang = "vi"; // hoặc lấy từ headers nếu cần
  const { t } = await getServerTranslation("landing", lang);

  // Lấy category slug từ params
  const categorySlug = params.category;

  // Lấy thông tin category từ database dựa vào slug
  const categoryInDb = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  // Nếu không tìm thấy category, trả về thông báo
  if (!categoryInDb) {
    return (
      <div className="product-page">
        <h1 className="product-title">{t("productListTitle")}: {categorySlug}</h1>
        <p>Không tìm thấy danh mục này trong hệ thống.</p>
      </div>
    );
  }

  // Lấy sản phẩm từ database dựa vào categoryId
  const products = await prisma.product.findMany({
    where: { categoryId: categoryInDb.id },
    include: { images: true }, // Lấy hình ảnh của sản phẩm
  });

  const title = t("productListTitle");

  return (
    <div className="product-page">
      <h1 className="product-title">
        {title}: {categoryInDb.name}
      </h1>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          products.map((p) => (
            <Link key={p.id} href={`/products/${categorySlug}/${p.id}`}>
              <div className="product-card">
                <img
                  src={p.images[0]?.url || "/default-product.png"}
                  alt={p.name}
                  className="product-image"
                />
                <div className="product-info">
                  <p className="product-name">{p.name}</p>
                  <p className="product-price">{p.price}₫</p>
                  <p className="product-weight">{p.weight}kg</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
