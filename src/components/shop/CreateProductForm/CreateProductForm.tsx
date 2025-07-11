"use client";

import "./CreateProductForm.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DeliverySelect from "@/components/shop/DeliverySelect/DeliverySelect"; // Import DeliverySelect component

export default function CreateProductForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    weight: "",
    availability: "IN_STOCK",
    delivery: "TODAY",
    minOrder: "",
    description: "",
    categoryId: "",
    images: [] as File[], // Thêm mảng để lưu các tệp hình ảnh
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (value: string) => {
    setForm((prev) => ({ ...prev, delivery: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    // Kiểm tra xem files có phải là null hay không
    if (files) {
        setForm((prev) => ({ ...prev, images: Array.from(files) }));
    }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(); // Sử dụng FormData để gửi hình ảnh và dữ liệu cùng một lúc
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("weight", form.weight);
    formData.append("availability", form.availability);
    formData.append("delivery", form.delivery);
    formData.append("minOrder", form.minOrder);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId);

    // Thêm từng tệp hình ảnh vào FormData
    form.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    const res = await fetch("/api/shop/product/create", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/shop");
    } else {
      alert("Thêm sản phẩm thất bại");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Tên sản phẩm" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Giá (VD: 19.99)" type="number" step="0.01" required />
      <input name="weight" value={form.weight} onChange={handleChange} placeholder="Khối lượng (VD: 1.5)" type="number" step="0.01" required />
      
      <select name="availability" value={form.availability} onChange={handleChange} required>
        <option value="IN_STOCK">Còn hàng</option>
        <option value="LIMITED_STOCK">Hết hàng</option>
      </select>

      <DeliverySelect value={form.delivery} onChange={handleDeliveryChange} />

      <input name="minOrder" value={form.minOrder} onChange={handleChange} placeholder="Đơn tối thiểu (VD: 1kg)" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả sản phẩm" required />

      <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
        <option value="">-- Chọn danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <input type="file" multiple onChange={handleImageChange} /> {/* Chọn nhiều hình ảnh */}

      <button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "➕ Thêm sản phẩm"}
      </button>
    </form>
  );
}
