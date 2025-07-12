"use client";

import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  productId,
  confirmText,
}: {
  productId: string;
  confirmText: string;
}) {
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(confirmText)) return;

    const res = await fetch(`/api/shop/product/delete/${productId}`, {
      method: "POST",
    });

    if (res.ok) {
      router.refresh(); // reload shop list
    } else {
      alert("Xóa sản phẩm thất bại.");
      console.log("Product ID:", productId); // Log ID để kiểm tra
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="text-red-600 underline" style={{cursor:"pointer"}}>
        Xóa
      </button>
    </form>
  );
}
