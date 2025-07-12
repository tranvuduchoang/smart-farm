"use client";

import { useState, useEffect } from "react";
import {
  marketplaceProducts,
  productCategories,
  filters,
  Product,
} from "@/data/marketplace";
import {
  FaSearch,
  FaFilter,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaLeaf,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Image from "next/image";
import "./marketplace.css";

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>(marketplaceProducts);
  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(marketplaceProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showFreshOnly, setShowFreshOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = filters.priceRanges.find(
        (r) => r.id === selectedPriceRange,
      );
      if (range) {
        filtered = filtered.filter(
          (product) => product.price >= range.min && product.price <= range.max,
        );
      }
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter((product) =>
        product.location.includes(selectedLocation),
      );
    }

    // Organic filter
    if (showOrganicOnly) {
      filtered = filtered.filter((product) => product.organic);
    }

    // Fresh filter
    if (showFreshOnly) {
      filtered = filtered.filter((product) => product.fresh);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedPriceRange,
    selectedLocation,
    showOrganicOnly,
    showFreshOnly,
    sortBy,
    products,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="marketplace-page">
      {/* Hero Section */}
      <section className="marketplace-hero">
        <div className="hero-content">
          <h1>Chợ nông sản AgriChain</h1>
          <p>Khám phá hàng ngàn sản phẩm tươi ngon từ các nông trại uy tín</p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box-marketplace">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Bộ lọc
            </button>
          </div>
        </div>
      </section>

      <div className="marketplace-content">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? "show" : ""}`}>
          <div className="filter-section">
            <h3>Danh mục</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value="all"
                  checked={selectedCategory === "all"}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                Tất cả ({marketplaceProducts.length})
              </label>
              {productCategories.map((category) => (
                <label key={category.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  {category.name} ({category.count})
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Giá</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="price"
                  value=""
                  checked={selectedPriceRange === ""}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                />
                Tất cả
              </label>
              {filters.priceRanges.map((range) => (
                <label key={range.id} className="filter-option">
                  <input
                    type="radio"
                    name="price"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Địa điểm</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="location"
                  value=""
                  checked={selectedLocation === ""}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                />
                Tất cả
              </label>
              {filters.locations.map((location) => (
                <label key={location} className="filter-option">
                  <input
                    type="radio"
                    name="location"
                    value={location}
                    checked={selectedLocation === location}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                  {location}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Tính năng</h3>
            <div className="filter-options">
              <label className="filter-option checkbox">
                <input
                  type="checkbox"
                  checked={showOrganicOnly}
                  onChange={(e) => setShowOrganicOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                Chỉ sản phẩm hữu cơ
              </label>
              <label className="filter-option checkbox">
                <input
                  type="checkbox"
                  checked={showFreshOnly}
                  onChange={(e) => setShowFreshOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                Chỉ sản phẩm tươi
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              <span>{filteredProducts.length} sản phẩm được tìm thấy</span>
            </div>
            <div className="sort-options">
              <label>Sắp xếp theo:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Phổ biến</option>
                <option value="price-low">Giá thấp đến cao</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="product-image"
                  />
                  {product.discount && (
                    <span className="discount-badge">-{product.discount}%</span>
                  )}
                  {product.organic && (
                    <span className="organic-badge">
                      <FaLeaf /> Hữu cơ
                    </span>
                  )}
                  <div className="product-actions">
                    <button className="action-btn">
                      <FaHeart />
                    </button>
                    <button className="action-btn cart-btn">
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-location">
                    <FaMapMarkerAlt />
                    <span>{product.location}</span>
                  </div>
                  <div className="product-seller">Bởi: {product.seller}</div>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.floor(product.rating) ? "filled" : ""
                          }
                        />
                      ))}
                    </div>
                    <span>
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                  <div className="product-price">
                    {product.originalPrice && (
                      <span className="original-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="current-price">
                      {formatPrice(product.price)}/{product.unit}
                    </span>
                  </div>
                  <button className="add-to-cart-btn">Thêm vào giỏ hàng</button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProducts.length === 0 && (
            <div className="no-results">
              <h3>Không tìm thấy sản phẩm nào</h3>
              <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
