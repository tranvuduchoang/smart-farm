// src/app/landing/page.tsx
"use client";

import { Button } from "@/components/ui/button/button";
import "../landing/landing.css";
import { useTranslation } from "react-i18next";
import CategorySection from "@/components/categories/CategorySection";
import { useEffect, useState } from "react";
import {
  FaLeaf,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaUsers,
  FaStore,
} from "react-icons/fa";

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
  const [isVisible, setIsVisible] = useState(false);

  const hero = t("hero", { returnObjects: true }) as HeroContent;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          // Fallback to static data if API fails
          const staticCategories = t("categories", {
            returnObjects: true,
          }) as CategoryItem[];
          setCategories(
            staticCategories.map((cat, index) => ({
              ...cat,
              id: String(index + 1),
            })),
          );
        }
      } catch (error) {
        // Fallback to static data
        const staticCategories = t("categories", {
          returnObjects: true,
        }) as CategoryItem[];
        setCategories(
          staticCategories.map((cat, index) => ({
            ...cat,
            id: String(index + 1),
          })),
        );
      }
    };

    fetchCategories();

    // Trigger animation on page load
    setTimeout(() => setIsVisible(true), 100);
  }, [t]);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className={`hero-content ${isVisible ? "animate-fade-in" : ""}`}>
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
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Nông dân</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Sản phẩm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">25,000+</span>
              <span className="stat-label">Khách hàng</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tại sao chọn AgriChain?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3>100% Hữu cơ</h3>
              <p>
                Tất cả sản phẩm đều được chứng nhận hữu cơ, không chất bảo quản
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Giao hàng tận nơi</h3>
              <p>Giao hàng nhanh chóng trong vòng 24h, đảm bảo tươi ngon</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Truy xuất nguồn gốc</h3>
              <p>Theo dõi đầy đủ hành trình từ nông trại đến bàn ăn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-box">
              <FaUsers className="stat-icon" />
              <h3>25,000+</h3>
              <p>Khách hàng tin tưởng</p>
            </div>
            <div className="stat-box">
              <FaStore className="stat-icon" />
              <h3>500+</h3>
              <p>Nông trại hợp tác</p>
            </div>
            <div className="stat-box">
              <FaStar className="stat-icon" />
              <h3>4.9/5</h3>
              <p>Đánh giá khách hàng</p>
            </div>
            <div className="stat-box">
              <FaTruck className="stat-icon" />
              <h3>99%</h3>
              <p>Giao hàng đúng hẹn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <CategorySection categories={categories} />

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                "Sản phẩm rất tươi ngon, giao hàng nhanh chóng. Tôi rất hài lòng
                với chất lượng dịch vụ."
              </p>
              <div className="testimonial-author">
                <span className="author-name">Chị Nga, Hà Nội</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                "AgriChain giúp tôi yên tâm về nguồn gốc thực phẩm cho gia đình.
                Rất đáng tin cậy!"
              </p>
              <div className="testimonial-author">
                <span className="author-name">Anh Minh, TP.HCM</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="stars">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <p>
                "Giao diện dễ sử dụng, sản phẩm phong phú. Gia đình tôi đã
                chuyển sang mua sắm ở đây hoàn toàn."
              </p>
              <div className="testimonial-author">
                <span className="author-name">Cô Linh, Đà Nẵng</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Bắt đầu mua sắm thực phẩm sạch ngay hôm nay!</h2>
            <p>Tham gia cộng đồng hơn 25,000 khách hàng tin tưởng AgriChain</p>
            <div className="cta-buttons">
              <Button className="btn-primary">Khám phá sản phẩm</Button>
              <Button className="btn-secondary">Đăng ký nhận ưu đãi</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
