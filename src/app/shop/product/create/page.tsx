"use client";

import "./CreateProduct.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateProductForm from "@/components/shop/CreateProductForm/CreateProductForm"; // Import Client Component

export default function CreateProductPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div className="create-product-container">
      <h1>Thêm sản phẩm mới</h1>
      <CreateProductForm categories={categories} />
    </div>
  );
}
