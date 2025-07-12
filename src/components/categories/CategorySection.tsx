import "./CategorySection.css";
import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/app/landing/page";
import { useTranslation } from "react-i18next";

interface CategorySectionProps {
  categories: CategoryItem[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  const { t } = useTranslation("landing");
  const sectionTitle = t("sectionTitle");

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">{sectionTitle}</h2>
        <div className="category-grid">
          {categories.map((item, index) => (
            <Link key={item.slug} href={`/products/${item.slug.toLowerCase()}`}>
              <div
                className="category-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="category-image-container">
                  <Image
                    src={
                      item.image || `/categories/${item.slug.toLowerCase()}.jpg`
                    }
                    alt={item.name}
                    width={200}
                    height={200}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <span className="category-explore">Khám phá</span>
                  </div>
                </div>
                <p className="category-name">{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
