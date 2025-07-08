"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { mockProducts } from "@/data/products";
import "./product-detail.css";
import { Button } from "@/components/ui/button/button";
import { FaShoppingCart } from "react-icons/fa";

interface Product {
    name: string;
    slug: string;
    price: string;
    weight: string;
    image: string;
    category: string;
    availability: string;
    delivery: string;
    minOrder: string;
    description: string;
    gallery: string[];
    rating: number;
    reviewCount: number;
    ratingDistribution: { [stars: number]: number };
}

export default function ProductDetailPage() {
    const { t } = useTranslation("productDetail");
    const { product } = useParams();
    const selected = mockProducts.find((p) => p.slug === product);
    const descriptionList = t("description", { returnObjects: true }) as Product[];

    const translatedDescription = selected
        ? descriptionList.find((item) => item.slug === selected.slug)?.description ?? selected.description
        : "";

    if (!selected) return <div>{t(`noProduct`)}</div>;

    return (
        <div className="product-detail-page">
            <section
                className="hero-banner"
                style={{ backgroundImage: `url(${selected.image})` }}
            >
                <div className="hero-content">
                    <h1>{selected.name}</h1>
                    <p>{t(`heroContent`)}</p>
                    <div className="search-box">
                        <input type="text" placeholder="Enter delivery address" className="search-field" />
                        <Button className="btn-search">{t(`buttonSearch`)}</Button>
                    </div>
                </div>
            </section>

            <section className="product-info">
                <h2><strong>{t(`productDeatil`)}</strong></h2>
                <div className="info-grid">
                    <div><strong>{t(`price`)}</strong><p>{selected.price}</p></div>
                    <div>
                        <strong>{t(`availability`)}</strong>
                        <p>
                            {selected.availability.toLowerCase() === "instock"
                                ? t("inStock")
                                : selected.availability.toLowerCase() === "limitedstock"
                                    ? t("limitedStock")
                                    : selected.availability
                            }
                        </p>
                    </div>
                    <div>
                        <strong>{t(`delivery`)}</strong>
                        <p>
                            {selected.delivery.toLowerCase() === "today"
                                ? t("today")
                                : selected.delivery.toLowerCase() === "tomorrow"
                                    ? t("tomorrow")
                                    : selected.delivery}
                        </p>
                    </div>
                    <div><strong>{t(`minimumOrder`)}</strong><p>{selected.minOrder}</p></div>
                    <button className="add-to-cart-btn">
                        <FaShoppingCart style={{ marginRight: "6px" }} />
                        {t(`addToCard`)}
                    </button>
                </div>
            </section>

            <section className="product-description">
                <h2><strong>{t(`productDescription`)}</strong></h2>
                <p>{translatedDescription}</p>
                <div className="gallery">
                    {selected.gallery.map((img) => (
                        <img key={img} src={img} alt={selected.name} />
                    ))}
                </div>
            </section>

            <section className="product-reputation">
                <h2>{t(`reputation`)}</h2>
                <div className="rating-score">
                    <div className="score">{selected.rating}</div>
                    <div>
                        {"★".repeat(Math.round(selected.rating))} ({selected.reviewCount} reviews)
                    </div>
                </div>
                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="bar-row">
                            <span>{star}</span>
                            <div className="bar">
                                <div
                                    className="filled"
                                    style={{ width: `${selected.ratingDistribution[star]}%` }}
                                />
                            </div>
                            <span>{selected.ratingDistribution[star]}%</span>
                        </div>
                    ))}
                </div>
                <p className="note">
                    {t(`note`)}
                </p>
            </section>
        </div>
    );
}
