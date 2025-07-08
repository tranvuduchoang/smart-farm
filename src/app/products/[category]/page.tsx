"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { mockProducts } from "@/data/products";
import "./product-list.css";
import Link from "next/link";

export default function ProductListPage() {
    const { t } = useTranslation("landing");
    const params = useParams();
    const category = Array.isArray(params.category) ? params.category[0] : params.category;

    // lấy categories từ file dịch
    const categories = t("categories", { returnObjects: true }) as {
        name: string;
        slug: string;
        image: string;
    }[];

    const title = t("productListTitle");
    const categoryData = categories.find((c) => c.slug === category);
    const products = mockProducts.filter((p) => p.category === category);

    return (
        <div className="product-page">
            <h1 className="product-title">
                {title}: {categoryData?.name ?? category}
            </h1>

            <div className="product-grid">
                {products.map((p) => (
                    <Link key={p.name} href={`/products/${p.category}/${p.slug}`}>
                        <div  className="product-card">
                            <img src={p.image} alt={p.name} className="product-image" />
                            <div className="product-info">
                                <p className="product-name">{p.name}</p>
                                <p className="product-price">{p.price}</p>
                                <p className="product-weight">{p.weight}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
