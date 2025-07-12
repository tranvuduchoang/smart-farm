"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaCertificate,
  FaLeaf,
  FaTractor,
  FaBox,
  FaShoppingCart,
  FaTruck,
  FaCheck,
  FaChartLine,
} from "react-icons/fa";
import Image from "next/image";
import "./supplierManagement.css";

interface SupplierProduct {
  id: string;
  name: string;
  price: number;
  unit: string;
  availability: string;
  delivery: string;
  minOrder: string;
  description: string;
  images: string[];
  categoryId: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  orderedAt: string;
  user: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    supplierProduct: {
      name: string;
      unit: string;
    };
  }[];
}

interface SupplierData {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string | null;
  rating: number;
  reviewCount: number;
  products: string[];
  certifications: string[];
  specialties: string[];
  established: number;
  farmSize: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string | null;
  totalProducts: number;
  monthlyOrders: number;
  satisfactionRate: number;
  supplierProducts: SupplierProduct[];
  orders: Order[];
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function SupplierManagementPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "products" | "orders">(
    "info",
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    description: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
    contactWebsite: "",
    farmSize: "",
    products: [] as string[],
    certifications: [] as string[],
    specialties: [] as string[],
  });

  useEffect(() => {
    if (params.id) {
      fetchSupplier();
    }
  }, [params.id]);

  const fetchSupplier = async () => {
    try {
      const response = await fetch(`/api/suppliers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSupplier(data);
        setEditData({
          name: data.name,
          description: data.description,
          location: data.location,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          contactWebsite: data.contactWebsite || "",
          farmSize: data.farmSize,
          products: JSON.parse(data.products || "[]"),
          certifications: JSON.parse(data.certifications || "[]"),
          specialties: JSON.parse(data.specialties || "[]"),
        });
      } else {
        router.push("/suppliers");
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
      router.push("/suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/suppliers/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        await fetchSupplier();
        setIsEditing(false);
        alert("Thông tin đã được cập nhật thành công!");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Không thể cập nhật thông tin"}`);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/suppliers/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Nhà cung cấp đã được xóa thành công!");
        router.push("/suppliers");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Không thể xóa nhà cung cấp"}`);
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Đã xảy ra lỗi khi xóa nhà cung cấp");
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchSupplier();
        alert("Trạng thái đơn hàng đã được cập nhật!");
      } else {
        alert("Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái");
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f39c12";
      case "CONFIRMED":
        return "#3498db";
      case "SHIPPED":
        return "#9b59b6";
      case "DELIVERED":
        return "#27ae60";
      case "CANCELLED":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPED":
        return "Đã gửi";
      case "DELIVERED":
        return "Đã nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="supplier-management-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin nhà cung cấp...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="supplier-management-page">
        <div className="error-container">
          <h2>Không tìm thấy nhà cung cấp</h2>
          <button
            onClick={() => router.push("/suppliers")}
            className="btn-primary"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id === supplier.owner?.id;

  return (
    <div className="supplier-management-page">
      <div className="supplier-management-container">
        {/* Header */}
        <div className="supplier-header">
          <div className="supplier-header-content">
            <div className="supplier-image-section">
              {supplier.image && (
                <Image
                  src={supplier.image}
                  alt={supplier.name}
                  width={200}
                  height={200}
                  className="supplier-main-image"
                />
              )}
            </div>

            <div className="supplier-main-info">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="edit-title-input"
                />
              ) : (
                <h1>{supplier.name}</h1>
              )}

              <div className="supplier-location">
                <FaMapMarkerAlt />
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="edit-input"
                  />
                ) : (
                  <span>{supplier.location}</span>
                )}
              </div>

              <div className="supplier-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(supplier.rating) ? "filled" : ""
                      }
                    />
                  ))}
                </div>
                <span>
                  {supplier.rating.toFixed(1)} ({supplier.reviewCount} đánh giá)
                </span>
              </div>

              <div className="supplier-established">
                <FaTractor />
                <span>Thành lập {supplier.established}</span>
              </div>
            </div>

            {isOwner && (
              <div className="supplier-actions">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} className="btn-save">
                      <FaSave /> Lưu
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn-cancel"
                    >
                      <FaTimes /> Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-edit"
                    >
                      <FaEdit /> Chỉnh sửa
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn-delete"
                    >
                      <FaTrash /> Xóa
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="supplier-stats-section">
          <div className="stat-card">
            <FaBox className="stat-icon" />
            <div>
              <span className="stat-number">{supplier.totalProducts}</span>
              <span className="stat-label">Sản phẩm</span>
            </div>
          </div>
          <div className="stat-card">
            <FaShoppingCart className="stat-icon" />
            <div>
              <span className="stat-number">{supplier.monthlyOrders}</span>
              <span className="stat-label">Đơn/tháng</span>
            </div>
          </div>
          <div className="stat-card">
            <FaChartLine className="stat-icon" />
            <div>
              <span className="stat-number">{supplier.satisfactionRate}%</span>
              <span className="stat-label">Hài lòng</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Sản phẩm ({supplier.supplierProducts?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Đơn hàng ({supplier.orders?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "info" && (
            <div className="info-tab">
              <div className="info-section">
                <h3>Mô tả</h3>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="edit-textarea"
                    rows={4}
                  />
                ) : (
                  <p>{supplier.description}</p>
                )}
              </div>

              <div className="info-section">
                <h3>Quy mô trang trại</h3>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.farmSize}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        farmSize: e.target.value,
                      }))
                    }
                    className="edit-input"
                  />
                ) : (
                  <p>{supplier.farmSize}</p>
                )}
              </div>

              <div className="contact-section">
                <h3>Thông tin liên hệ</h3>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaPhone />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contactPhone}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            contactPhone: e.target.value,
                          }))
                        }
                        className="edit-input"
                      />
                    ) : (
                      <span>{supplier.contactPhone}</span>
                    )}
                  </div>
                  <div className="contact-item">
                    <FaEnvelope />
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.contactEmail}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            contactEmail: e.target.value,
                          }))
                        }
                        className="edit-input"
                      />
                    ) : (
                      <span>{supplier.contactEmail}</span>
                    )}
                  </div>
                  {(supplier.contactWebsite || isEditing) && (
                    <div className="contact-item">
                      <FaGlobe />
                      {isEditing ? (
                        <input
                          type="url"
                          value={editData.contactWebsite}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              contactWebsite: e.target.value,
                            }))
                          }
                          className="edit-input"
                          placeholder="https://example.com"
                        />
                      ) : (
                        <span>{supplier.contactWebsite}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Sản phẩm chính</h3>
                <div className="tags-list">
                  {JSON.parse(supplier.products || "[]").map(
                    (product: string, index: number) => (
                      <span key={index} className="tag">
                        {product}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Chứng nh���n</h3>
                <div className="certification-list">
                  {JSON.parse(supplier.certifications || "[]").map(
                    (cert: string, index: number) => (
                      <span key={index} className="certification-badge">
                        <FaCertificate />
                        {cert}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Chuyên môn</h3>
                <div className="specialties-list">
                  {JSON.parse(supplier.specialties || "[]").map(
                    (specialty: string, index: number) => (
                      <span key={index} className="specialty-tag">
                        <FaLeaf />
                        {specialty}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="products-tab">
              {isOwner && (
                <div className="products-header">
                  <button
                    onClick={() =>
                      router.push(`/suppliers/${params.id}/products/create`)
                    }
                    className="btn-add-product"
                  >
                    <FaPlus /> Thêm sản ph��m
                  </button>
                </div>
              )}

              <div className="products-grid">
                {supplier.supplierProducts?.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-images">
                      {product.images.length > 0 && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={200}
                          height={150}
                          className="product-image"
                        />
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">
                        {product.price.toLocaleString("vi-VN")}đ/{product.unit}
                      </p>
                      <p className="product-description">
                        {product.description}
                      </p>
                      <div className="product-details">
                        <span className="availability">
                          {product.availability === "IN_STOCK"
                            ? "Còn hàng"
                            : "Sắp hết"}
                        </span>
                        <span className="min-order">
                          Tối thiểu: {product.minOrder}
                        </span>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="product-actions">
                        <button
                          onClick={() =>
                            router.push(
                              `/suppliers/${params.id}/products/${product.id}/edit`,
                            )
                          }
                          className="btn-edit-product"
                        >
                          <FaEdit />
                        </button>
                        <button className="btn-delete-product">
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {(!supplier.supplierProducts ||
                supplier.supplierProducts.length === 0) && (
                <div className="empty-state">
                  <FaBox className="empty-icon" />
                  <h3>Chưa có sản phẩm nào</h3>
                  {isOwner && <p>Hãy thêm sản phẩm đầu tiên của bạn</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="orders-tab">
              <div className="orders-list">
                {supplier.orders?.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        Đơn hàng #{order.id.slice(-8)}
                      </div>
                      <div
                        className="order-status"
                        style={{
                          backgroundColor: getOrderStatusColor(order.status),
                        }}
                      >
                        {getOrderStatusText(order.status)}
                      </div>
                    </div>

                    <div className="order-info">
                      <div className="order-customer">
                        <strong>Khách hàng:</strong> {order.user.name} (
                        {order.user.email})
                      </div>
                      <div className="order-date">
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(order.orderedAt).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="order-total">
                        <strong>Tổng tiền:</strong>{" "}
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </div>
                    </div>

                    <div className="order-items">
                      <h5>Sản phẩm:</h5>
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <span>{item.supplierProduct.name}</span>
                          <span>
                            {item.quantity} {item.supplierProduct.unit}
                          </span>
                          <span>{item.price.toLocaleString("vi-VN")}đ</span>
                        </div>
                      ))}
                    </div>

                    {isOwner &&
                      order.status !== "DELIVERED" &&
                      order.status !== "CANCELLED" && (
                        <div className="order-actions">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "CONFIRMED")
                              }
                              className="btn-confirm"
                            >
                              <FaCheck /> Xác nhận
                            </button>
                          )}
                          {order.status === "CONFIRMED" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "SHIPPED")
                              }
                              className="btn-ship"
                            >
                              <FaTruck /> Gửi hàng
                            </button>
                          )}
                          {order.status === "SHIPPED" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "DELIVERED")
                              }
                              className="btn-deliver"
                            >
                              <FaCheck /> Đã giao
                            </button>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>

              {(!supplier.orders || supplier.orders.length === 0) && (
                <div className="empty-state">
                  <FaShoppingCart className="empty-icon" />
                  <h3>Chưa có đơn hàng nào</h3>
                  <p>Các đơn hàng sẽ xuất hiện ở đây</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa nhà cung cấp</h3>
            <p>
              Bạn có chắc chắn muốn xóa nhà cung cấp này? Hành động này không
              thể hoàn tác.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-cancel"
              >
                Hủy
              </button>
              <button onClick={handleDelete} className="btn-delete">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
