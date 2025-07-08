"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button/button";
import "../landing/landing.css";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface HeroContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  buttonSearch: string;
}

interface CategoryItem {
  slug: string;
  name: string;
  image: string;
}

export default function LandingPage() {
  const { t } = useTranslation("landing");

  const hero = t("hero", { returnObjects: true }) as HeroContent;
  const categories = t("categories", { returnObjects: true }) as CategoryItem[];
  const sectionTitle = t("sectionTitle");

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: "url('/farm-bg.jpg')" }}
      >
        <h1 className="hero-title">{hero.title}</h1>
        <p className="hero-subtitle">{hero.subtitle}</p>
        <div className="search-box">
          <input
            type="text"
            placeholder={hero.searchPlaceholder}
            className="search-field"
          />
          <Button className="btn-search">{hero.buttonSearch}</Button>
        </div>
      </section>

      {/* Category Section */}
      <section className="category-section">
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="category-grid">
          {categories.map((item: any) => (
            <Link key={item.slug} href={`/products/${item.slug.toLowerCase()}`}>
              <div className="category-item">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="category-image"
                />
                <p className="category-name">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
