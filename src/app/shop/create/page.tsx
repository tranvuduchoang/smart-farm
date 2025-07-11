"use client";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./createShop.css";

type FormValues = {
  name: string;
  description: string;
  imageUrl: string;
};

export default function CreateYourOwnShopPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    // Nếu user không phải NORMAL_USER thì redirect
    if (status === "authenticated" && session?.user?.role !== "NORMAL_USER") {
      router.push("/");
    }
  }, [session, status]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/shop/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Tạo cửa hàng thành công!");
        router.push("/shop"); // chuyển đến trang quản lý shop
      } else {
        const json = await res.json();
        alert(json.error || "Đã xảy ra lỗi khi tạo cửa hàng");
      }
    } catch (error) {
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div className="shop-create-container">
      <h1 className="shop-title">Tạo cửa hàng của bạn</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="shop-form">
        <div className="shop-form-group">
          <label>Tên cửa hàng *</label>
          <input
            {...register("name", { required: "Vui lòng nhập tên cửa hàng" })}
            className="shop-input"
            placeholder="VD: Shop Nông Sản A"
          />
          {errors.name && <p className="shop-error">{errors.name.message}</p>}
        </div>

        <div className="shop-form-group">
          <label>Mô tả</label>
          <textarea
            {...register("description")}
            className="shop-textarea"
            placeholder="Thông tin mô tả cửa hàng của bạn..."
          />
        </div>

        <div className="shop-form-group">
          <label>Ảnh đại diện (URL)</label>
          <input
            {...register("imageUrl")}
            className="shop-input"
            placeholder="https://example.com/image.png"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="shop-submit-btn"
        >
          {isSubmitting ? "Đang tạo..." : "Tạo cửa hàng"}
        </button>
      </form>
    </div>
  );
}
