"use client";

import "./CreateProductForm.css";
import { useRouter } from "next/navigation";
import DeliverySelect from "@/components/shop/DeliverySelect/DeliverySelect";
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

type FileType = RcFile;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function CreateProductForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]); // 👈 Rỗng

  const [form, setForm] = useState({
    name: "",
    price: "",
    weight: "",
    availability: "IN_STOCK",
    delivery: "TODAY",
    minOrder: "",
    description: "",
    categoryId: "",
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (value: string) => {
    setForm((prev) => ({ ...prev, delivery: value }));
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChangeImage: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("weight", form.weight);
    formData.append("availability", form.availability);
    formData.append("delivery", form.delivery);
    formData.append("minOrder", form.minOrder);
    formData.append("description", form.description);
    formData.append("categoryId", form.categoryId);

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
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên sản phẩm"
        required
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Giá (VD: 19.99)"
        type="number"
        step="0.01"
        required
      />
      <input
        name="weight"
        value={form.weight}
        onChange={handleChange}
        placeholder="Khối lượng (VD: 1.5)"
        type="number"
        step="0.01"
        required
      />

      <select
        name="availability"
        value={form.availability}
        onChange={handleChange}
        required
      >
        <option value="IN_STOCK">Còn hàng</option>
        <option value="LIMITED_STOCK">Hết hàng</option>
      </select>

      <DeliverySelect value={form.delivery} onChange={handleDeliveryChange} />

      <input
        name="minOrder"
        value={form.minOrder}
        onChange={handleChange}
        placeholder="Đơn tối thiểu (VD: 1kg)"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Mô tả sản phẩm"
        required
      />

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        required
      >
        <option value="">-- Chọn danh mục --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <Upload
        customRequest={async ({ file, onSuccess, onError }) => {
          const formData = new FormData();
          formData.append("images", file);

          try {
            const res = await fetch("/api/uploadImage", {
              method: "POST",
              body: formData,
            });

            const text = await res.text();
            if (!res.ok) {
              console.error("Upload failed:", res.status, text);
              throw new Error("Upload failed");
            }

            const data = JSON.parse(text);
            const url = data.urls[0].url;

            setForm((prev) => ({
              ...prev,
              images: [...prev.images, url],
            }));

            onSuccess?.("ok");
          } catch (err) {
            console.error("Upload error:", err);
            onError?.(err as Error);
          }
        }}

        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChangeImage}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Đang thêm..." : "➕ Thêm sản phẩm"}
      </button>
    </form>
  );
}
