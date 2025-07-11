"use client";

export default function DeleteProductButton({ productId, confirmText }: { productId: string, confirmText: string }) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(confirmText)) return;

    await fetch(`/shop/product/delete/${productId}`, {
      method: "POST",
    });
    window.location.reload(); // Or use router.refresh() if using next/navigation
  };

  return (
    <form onSubmit={handleDelete}>
      <button type="submit" className="text-red-600 underline">
        Xóa
      </button>
    </form>
  );
}