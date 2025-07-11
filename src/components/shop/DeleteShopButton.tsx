"use client";

export function DeleteShopButton() {
  const handleDelete = async () => {
    const confirmed = confirm("Bạn chắc chắn muốn xóa cửa hàng? Thao tác này sẽ không thể hoàn tác.");
    if (!confirmed) return;

    const res = await fetch("/api/shop/delete", {
      method: "POST",
    });

    if (res.ok) {
      window.location.href = "/"; // Chuyển về trang chủ
    } else {
      alert("Xóa cửa hàng thất bại");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="delete-shop-btn"
    >
      Xóa cửa hàng
    </button>
  );
}
