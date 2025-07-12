"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { suppliers, Supplier } from "@/data/suppliers";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaCertificate,
  FaLeaf,
  FaTractor,
} from "react-icons/fa";
import Image from "next/image";
import "./suppliers.css";

export default function SuppliersPage() {
  const router = useRouter();
  const [filteredSuppliers, setFilteredSuppliers] =
    useState<Supplier[]>(suppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const locations = Array.from(
    new Set(suppliers.map((s) => s.location.split(", ")[1] || s.location)),
  );
  const specialties = Array.from(
    new Set(suppliers.flatMap((s) => s.specialties)),
  );

  useEffect(() => {
    let filtered = [...suppliers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.specialties.some((s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((supplier) =>
        supplier.location.includes(selectedLocation),
      );
    }

    // Specialty filter
    if (selectedSpecialty) {
      filtered = filtered.filter((supplier) =>
        supplier.specialties.includes(selectedSpecialty),
      );
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "established":
        filtered.sort((a, b) => a.established - b.established);
        break;
      case "products":
        filtered.sort((a, b) => b.stats.totalProducts - a.stats.totalProducts);
        break;
      case "orders":
        filtered.sort((a, b) => b.stats.monthlyOrders - a.stats.monthlyOrders);
        break;
      default:
        filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredSuppliers(filtered);
  }, [searchTerm, selectedLocation, selectedSpecialty, sortBy]);

  return (
    <div className="suppliers-page">
      {/* Hero Section */}
      <section className="suppliers-hero">
        <div className="hero-content">
          <h1>Nhà cung cấp uy tín</h1>
          <p>Kết nối với các nông trại và nhà cung cấp hàng đầu Việt Nam</p>

          {/* Search and Filters */}
          <div className="suppliers-filters">
            <div className="search-box-suppliers">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả địa điểm</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả chuyên môn</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="rating">Đánh giá cao nhất</option>
                <option value="established">Lâu đời nhất</option>
                <option value="products">Nhiều sản phẩm nhất</option>
                <option value="orders">Đơn hàng nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="suppliers-content">
        <div className="results-header">
          <span>{filteredSuppliers.length} nhà cung cấp được tìm thấy</span>
        </div>

        {/* Suppliers Grid */}
        <div className="suppliers-grid">
          {filteredSuppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card">
              <div className="supplier-header">
                <div className="supplier-image">
                  <Image
                    src={supplier.image}
                    alt={supplier.name}
                    width={300}
                    height={200}
                    className="supplier-photo"
                  />
                  <div className="supplier-badges">
                    {supplier.certifications.slice(0, 2).map((cert) => (
                      <span key={cert} className="certification-badge">
                        <FaCertificate />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="supplier-basic-info">
                  <h2 className="supplier-name">{supplier.name}</h2>
                  <div className="supplier-location">
                    <FaMapMarkerAlt />
                    <span>{supplier.location}</span>
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
                      {supplier.rating} ({supplier.reviewCount} đánh giá)
                    </span>
                  </div>
                  <div className="supplier-established">
                    <FaTractor />
                    <span>Thành lập {supplier.established}</span>
                  </div>
                </div>
              </div>

              <div className="supplier-description">
                <p>{supplier.description}</p>
              </div>

              <div className="supplier-details">
                <div className="detail-section">
                  <h4>Quy mô trang trại</h4>
                  <p>{supplier.farmSize}</p>
                </div>

                <div className="detail-section">
                  <h4>Sản phẩm chính</h4>
                  <div className="products-list">
                    {supplier.products.slice(0, 3).map((product) => (
                      <span key={product} className="product-tag">
                        {product}
                      </span>
                    ))}
                    {supplier.products.length > 3 && (
                      <span className="product-tag more">
                        +{supplier.products.length - 3} khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Chuyên môn</h4>
                  <div className="specialties-list">
                    {supplier.specialties.map((specialty) => (
                      <span key={specialty} className="specialty-tag">
                        <FaLeaf />
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="supplier-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {supplier.stats.totalProducts}
                  </span>
                  <span className="stat-label">Sản phẩm</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {supplier.stats.monthlyOrders}
                  </span>
                  <span className="stat-label">Đơn/tháng</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {supplier.stats.satisfactionRate}%
                  </span>
                  <span className="stat-label">Hài lòng</span>
                </div>
              </div>

              <div className="supplier-contact">
                <h4>Thông tin liên hệ</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaPhone />
                    <span>{supplier.contactInfo.phone}</span>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope />
                    <span>{supplier.contactInfo.email}</span>
                  </div>
                  {supplier.contactInfo.website && (
                    <div className="contact-item">
                      <FaGlobe />
                      <span>{supplier.contactInfo.website}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="supplier-actions">
                <button
                  className="btn-primary"
                  onClick={() => router.push(`/suppliers/${supplier.id}`)}
                >
                  Xem sản phẩm
                </button>
                <button className="btn-secondary">Liên hệ</button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSuppliers.length === 0 && (
          <div className="no-results">
            <h3>Không tìm thấy nhà cung cấp nào</h3>
            <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}
