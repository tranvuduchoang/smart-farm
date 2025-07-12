"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrash,
  FaCreditCard,
  FaMapMarkerAlt,
  FaStore,
  FaLeaf,
  FaArrowLeft,
  FaHeart,
} from "react-icons/fa";
import Image from "next/image";
import "./cart.css";

interface CartItem {
  id: string;
  quantity: number;
  supplierProduct: {
    id: string;
    name: string;
    price: number;
    unit: string;
    images: string[];
    description: string;
    minOrder: string;
    supplier: {
      id: string;
      name: string;
      location: string;
      rating: number;
    };
  };
}

interface CartSummary {
  totalItems: number;
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data for demonstration if no real data exists
  const mockCartItems: CartItem[] = [
    {
      id: "cart1",
      quantity: 2,
      supplierProduct: {
        id: "prod1",
        name: "Cà chua cherry hữu cơ",
        price: 45000,
        unit: "kg",
        images: [
          "https://images.unsplash.com/photo-1546470427-e9ea01b67a7c?w=400",
        ],
        description: "Cà chua cherry tươi ngon, trồng hoàn toàn hữu cơ",
        minOrder: "0.5kg",
        supplier: {
          id: "sup1",
          name: "Nông trại Hoa Đà Lạt",
          location: "Đà Lạt, Lâm Đồng",
          rating: 4.8,
        },
      },
    },
    {
      id: "cart2",
      quantity: 1,
      supplierProduct: {
        id: "prod2",
        name: "Rau cải xanh baby",
        price: 25000,
        unit: "kg",
        images: [
          "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
        ],
        description: "Rau cải xanh non tươi, được trồng thủy canh sạch",
        minOrder: "0.5kg",
        supplier: {
          id: "sup2",
          name: "Nông trại xanh Mekong",
          location: "An Giang",
          rating: 4.8,
        },
      },
    },
    {
      id: "cart3",
      quantity: 3,
      supplierProduct: {
        id: "prod3",
        name: "Xoài cát Hòa Lộc",
        price: 80000,
        unit: "kg",
        images: [
          "https://images.unsplash.com/photo-1553279013-112d35767a5b?w=400",
        ],
        description: "Xoài cát Hòa Lộc chính gốc, ngọt thơm tự nhiên",
        minOrder: "1kg",
        supplier: {
          id: "sup3",
          name: "HTX Xoài Hòa Lộc",
          location: "Tiền Giang",
          rating: 4.9,
        },
      },
    },
  ];

  useEffect(() => {
    if (session) {
      fetchCartItems();
    } else {
      // Use mock data for demo
      setCartItems(mockCartItems);
      setSelectedItems(mockCartItems.map((item) => item.id));
      setIsLoading(false);
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        setSelectedItems(data.items?.map((item: CartItem) => item.id) || []);
      } else {
        // Fallback to mock data
        setCartItems(mockCartItems);
        setSelectedItems(mockCartItems.map((item) => item.id));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // Fallback to mock data
      setCartItems(mockCartItems);
      setSelectedItems(mockCartItems.map((item) => item.id));
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(itemId);

    try {
      if (session) {
        const response = await fetch("/api/cart/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId,
            quantity: newQuantity,
          }),
        });

        if (response.ok) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item,
            ),
          );
        }
      } else {
        // Update mock data
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsUpdating(itemId);

    try {
      if (session) {
        const response = await fetch(`/api/cart/${itemId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCartItems((prev) => prev.filter((item) => item.id !== itemId));
          setSelectedItems((prev) => prev.filter((id) => id !== itemId));
        }
      } else {
        // Remove from mock data
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        setSelectedItems((prev) => prev.filter((id) => id !== itemId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const calculateSummary = (): CartSummary => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.includes(item.id),
    );
    const totalItems = selectedCartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalAmount = selectedCartItems.reduce(
      (sum, item) => sum + item.supplierProduct.price * item.quantity,
      0,
    );
    const shippingFee = totalAmount > 500000 ? 0 : 30000; // Free shipping over 500k VND
    const finalAmount = totalAmount + shippingFee;

    return {
      totalItems,
      totalAmount,
      shippingFee,
      finalAmount,
    };
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    const orderData = {
      items: cartItems.filter((item) => selectedItems.includes(item.id)),
      shippingAddress,
      notes,
      summary: calculateSummary(),
    };

    try {
      if (session) {
        const response = await fetch("/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          alert("Đặt hàng thành công!");
          router.push("/orders");
        } else {
          alert("Có lỗi xảy ra khi đặt hàng");
        }
      } else {
        alert("Đặt hàng thành công! (Demo mode)");
        // In demo mode, just clear selected items
        setCartItems((prev) =>
          prev.filter((item) => !selectedItems.includes(item.id)),
        );
        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi đặt hàng");
    }
  };

  const summary = calculateSummary();

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Header */}
        <div className="cart-header">
          <button onClick={() => router.back()} className="back-btn">
            <FaArrowLeft />
          </button>
          <h1>
            <FaShoppingCart />
            Giỏ hàng của bạn
          </h1>
          <span className="cart-count">({cartItems.length} sản phẩm)</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm yêu thích vào giỏ hàng</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="btn-continue-shopping"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Select All */}
            <div className="select-all-section">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={selectAllItems}
                />
                <span className="checkmark"></span>
                Chọn tất cả ({cartItems.length} sản phẩm)
              </label>
            </div>

            {/* Cart Items */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`cart-item ${selectedItems.includes(item.id) ? "selected" : ""}`}
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  <div className="item-image">
                    <Image
                      src={item.supplierProduct.images[0] || "/placeholder.jpg"}
                      alt={item.supplierProduct.name}
                      width={100}
                      height={100}
                      className="product-image"
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{item.supplierProduct.name}</h3>
                    <p className="item-description">
                      {item.supplierProduct.description}
                    </p>

                    <div className="supplier-info">
                      <FaStore />
                      <span>{item.supplierProduct.supplier.name}</span>
                      <FaMapMarkerAlt />
                      <span>{item.supplierProduct.supplier.location}</span>
                    </div>

                    <div className="item-meta">
                      <span className="min-order">
                        Tối thiểu: {item.supplierProduct.minOrder}
                      </span>
                      <div className="organic-badge">
                        <FaLeaf />
                        <span>Hữu cơ</span>
                      </div>
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="price-section">
                      <span className="price">
                        {item.supplierProduct.price.toLocaleString("vi-VN")}đ/
                        {item.supplierProduct.unit}
                      </span>
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1 || isUpdating === item.id}
                        className="qty-btn"
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity">
                        {isUpdating === item.id ? "..." : item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating === item.id}
                        className="qty-btn"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="item-total">
                      <span className="total-price">
                        {(
                          item.supplierProduct.price * item.quantity
                        ).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>

                    <div className="item-actions">
                      <button className="btn-favorite">
                        <FaHeart />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isUpdating === item.id}
                        className="btn-remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Section */}
            <div className="checkout-section">
              <div className="shipping-info">
                <h3>Thông tin giao hàng</h3>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ giao hàng *</label>
                  <input
                    type="text"
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Nhập địa chỉ giao hàng chi tiết"
                    className="shipping-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Ghi chú (không bắt buộc)</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú cho người bán..."
                    className="notes-input"
                    rows={3}
                  />
                </div>
              </div>

              <div className="order-summary">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Sản phẩm đã chọn:</span>
                    <span>{summary.totalItems} sản ph��m</span>
                  </div>
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{summary.totalAmount.toLocaleString("vi-VN")}đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span
                      className={
                        summary.shippingFee === 0 ? "free-shipping" : ""
                      }
                    >
                      {summary.shippingFee === 0
                        ? "Miễn phí"
                        : `${summary.shippingFee.toLocaleString("vi-VN")}đ`}
                    </span>
                  </div>
                  {summary.shippingFee === 0 &&
                    summary.totalAmount < 500000 && (
                      <div className="shipping-note">
                        <small>🎉 Bạn được miễn phí vận chuyển!</small>
                      </div>
                    )}
                  {summary.shippingFee > 0 && (
                    <div className="shipping-note">
                      <small>
                        💡 Mua thêm{" "}
                        {(500000 - summary.totalAmount).toLocaleString("vi-VN")}
                        đ để được miễn phí vận chuyển
                      </small>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span className="final-amount">
                      {summary.finalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    selectedItems.length === 0 || !shippingAddress.trim()
                  }
                  className="btn-checkout"
                >
                  <FaCreditCard />
                  Đặt hàng ({selectedItems.length} sản phẩm)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
