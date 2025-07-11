"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import prisma from "@/lib/prisma"; // Import Prisma
import { Button } from "@/components/ui/button/button";
import { FaShoppingCart } from "react-icons/fa";
import "./product-detail.css";

// Định nghĩa kiểu Product
interface Image {
  id: string;
  url: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  weight: number;
  availability: string;
  delivery: string;
  minOrder: string;
  description: string;
  reputation: number;
  images: Image[];  // Danh sách hình ảnh
  category: {
    name: string;
  };
}

export default function ProductDetailPage() {
    const { t } = useTranslation("productDetail");
    const { category, productId } = useParams(); // Lấy productId từ params

    const [productData, setProductData] = useState<Product | null>(null); // Chỉ định kiểu cho state
    const [loading, setLoading] = useState(true);

    // Kiểm tra nếu productId không hợp lệ
    if (!productId) {
        return <div>{t("no product ID")}</div>; // Nếu không có productId
    }

    useEffect(() => {
        // Fetch dữ liệu sản phẩm từ API hoặc Prisma
        const fetchProductData = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                const data = await response.json();
                setProductData(data);  // Lưu dữ liệu vào state
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]); // Khi productId thay đổi, fetch lại dữ liệu

    // Nếu đang trong quá trình loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // Nếu không tìm thấy sản phẩm
    if (!productData) {
        return <div>{t("noProduct")}</div>;
    }

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
