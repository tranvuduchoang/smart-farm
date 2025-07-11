"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import prisma from "@/lib/prisma"; // Import Prisma
import { Button } from "@/components/ui/button/button";
import { FaShoppingCart } from "react-icons/fa";
import "./product-detail.css";

// interface Product {
//     id:              String;
//   name:            String;
//   price:           String;
//   weight:          String;
//   availability:    String;
//   delivery:        String;
//   minOrder:        String;    // can be kg, gram, lbs, etc.
//   description:     String;
//   reputation:      String;
//   images:          Image[];   // list of image URLs
//   shopId:          String;
//   categoryId:      String;
//   createdAt:       String;
//   updatedAt:       String;
//   carts:           Cart[];
// }

export default async function ProductDetailPage() {
    const { t } = await useTranslation("productDetail");
    const { product } = useParams(); // Lấy product từ params

    // Kiểm tra xem product có phải là mảng không và lấy phần tử đầu tiên nếu cần
    const productId = Array.isArray(product) ? product[0] : product;

    // Kiểm tra nếu product có giá trị hợp lệ
    if (!product) {
        return <div>{t("noProduct")}</div>; // Nếu không có product
    }

    // Lấy thông tin sản phẩm từ database bằng Prisma qua product id
    const productData = await prisma.product.findUnique({
        where: {
            id: productId, // Truy vấn sản phẩm theo id
        },
        include: {
            images: true, // Lấy các hình ảnh của sản phẩm
            category: true, // Lấy thông tin category liên quan (nếu cần)
        },
    });

    // Nếu không tìm thấy sản phẩm
    if (!productData) {
        return <div>{t("noProduct")}</div>;
    }

    // // Mô tả sản phẩm từ file dịch (nếu có)
    // const translatedDescription = t("description", { returnObjects: true }) as { slug: string, description: string }[];
    // const description = translatedDescription.find((item) => item.slug === productData.slug)?.description ?? productData.description;

    return (
        <div className="product-detail-page">
            <section
                className="hero-banner"
                style={{ backgroundImage: `url(${productData.images[0]?.url || "/default-product.png"})` }}
            >
                <div className="hero-content">
                    <h1>{productData.name}</h1>
                    <p>{t("heroContent")}</p>
                    <div className="search-box">
                        <input type="text" placeholder="Enter delivery address" className="search-field" />
                        <Button className="btn-search">{t("buttonSearch")}</Button>
                    </div>
                </div>
            </section>

            <section className="product-info">
                <h2><strong>{t("productDeatil")}</strong></h2>
                <div className="info-grid">
                    <div><strong>{t("price")}</strong><p>{productData.price}₫</p></div>
                    <div>
                        <strong>{t("availability")}</strong>
                        <p>
                            {productData.availability.toLowerCase() === "instock"
                                ? t("inStock")
                                : productData.availability.toLowerCase() === "limitedstock"
                                    ? t("limitedStock")
                                    : productData.availability}
                        </p>
                    </div>
                    <div>
                        <strong>{t("delivery")}</strong>
                        <p>
                            {productData.delivery.toLowerCase() === "today"
                                ? t("today")
                                : productData.delivery.toLowerCase() === "tomorrow"
                                    ? t("tomorrow")
                                    : productData.delivery}
                        </p>
                    </div>
                    <div><strong>{t("minimumOrder")}</strong><p>{productData.minOrder}</p></div>
                    <button className="add-to-cart-btn">
                        <FaShoppingCart style={{ marginRight: "6px" }} />
                        {t("addToCard")}
                    </button>
                </div>
            </section>

            <section className="product-description">
                <h2><strong>{t("productDescription")}</strong></h2>
                <p>{productData.description}</p>
                <div className="gallery">
                    {productData.images.map((img) => (
                        <img key={img.id} src={img.url} alt={productData.name} />
                    ))}
                </div>
            </section>

            <section className="product-reputation">
                <h2>{t("reputation")}</h2>
                <div className="rating-score">
                    <div className="score">{productData.reputation}</div>
                    <div>
                        {"★".repeat(Math.round(productData.reputation))} ({productData.reputation} reviews)
                    </div>
                </div>
                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="bar-row">
                            <span>{star}</span>
                            <div className="bar">
                                <div
                                    className="filled"
                                    style={{ width: `${(productData.reputation / 5) * 100}%` }}
                                />
                            </div>
                            <span>{(productData.reputation / 5) * 100}%</span>
                        </div>
                    ))}
                </div>
                <p className="note">
                    {t("note")}
                </p>
            </section>
        </div>
    );
}
