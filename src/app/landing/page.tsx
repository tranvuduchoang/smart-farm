// src/app/landing/page.tsx
"use client";

import { Button } from "@/components/ui/button/button";
import "../landing/landing.css";
import { useTranslation } from "react-i18next";
import CategorySection from "@/components/categories/CategorySection";
import { useEffect, useState } from "react";

interface HeroContent {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  buttonSearch: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export default function LandingPage() {
  const { t } = useTranslation("landing");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  
  const hero = t("hero", { returnObjects: true }) as HeroContent;

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

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
      <CategorySection categories={categories} />
    </div>
  );
}
