import "./CategorySection.css";
import Image from "next/image";
import Link from "next/link";
import { CategoryItem } from "@/app/landing/page"; // Đảm bảo import đúng kiểu CategoryItem

interface CategorySectionProps {
  categories: CategoryItem[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="category-section">
      <h2 className="section-title">Categories</h2>
      <div className="category-grid">
        {categories.map((item) => (
          <Link key={item.slug} href={`/products/${item.slug.toLowerCase()}`}>
            <div className="category-item">
              <Image
                src={`/categories/${item.slug.toLowerCase()}.jpg`}
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
  );
}
