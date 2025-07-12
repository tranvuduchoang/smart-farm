"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload, FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import "./createSupplier.css";

interface SupplierFormData {
  name: string;
  description: string;
  location: string;
  image: string;
  contactPhone: string;
  contactEmail: string;
  contactWebsite: string;
  established: number;
  farmSize: string;
  products: string[];
  certifications: string[];
  specialties: string[];
}

export default function CreateSupplierPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    description: "",
    location: "",
    image: "",
    contactPhone: "",
    contactEmail: "",
    contactWebsite: "",
    established: new Date().getFullYear(),
    farmSize: "",
    products: [""],
    certifications: [""],
    specialties: [""],
  });

  const [errors, setErrors] = useState<Partial<SupplierFormData>>({});

  const handleInputChange = (
    field: keyof SupplierFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleArrayInputChange = (
    field: "products" | "certifications" | "specialties",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (
    field: "products" | "certifications" | "specialties",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "products" | "certifications" | "specialties",
    index: number,
  ) => {
    if (formData[field].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setFormData((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SupplierFormData> = {};

    if (!formData.name.trim()) newErrors.name = "Tên nhà cung cấp là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!formData.location.trim()) newErrors.location = "Địa điểm là bắt buộc";
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = "Số điện thoại là bắt buộc";
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = "Email là bắt buộc";
    if (!formData.farmSize.trim())
      newErrors.farmSize = "Quy mô trang trại là bắt buộc";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email không hợp lệ";
    }

    // Validate phone format (basic)
    const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        products: formData.products.filter((p) => p.trim()),
        certifications: formData.certifications.filter((c) => c.trim()),
        specialties: formData.specialties.filter((s) => s.trim()),
      };

      const response = await fetch("/api/suppliers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (response.ok) {
        router.push("/suppliers");
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || "Không thể tạo nhà cung cấp"}`);
      }
    } catch (error) {
      console.error("Error creating supplier:", error);
      alert("Đã xảy ra lỗi khi tạo nhà cung cấp");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-supplier-page">
      <div className="create-supplier-container">
        <div className="create-supplier-header">
          <h1>Tạo nhà cung cấp mới</h1>
          <p>Điền thông tin để tạo hồ sơ nhà cung cấp của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="create-supplier-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Thông tin cơ bản</h2>

            <div className="form-group">
              <label htmlFor="name">Tên nhà cung cấp *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "error" : ""}
                placeholder="Nhập tên nhà cung cấp"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={errors.description ? "error" : ""}
                placeholder="Mô tả về trang trại và hoạt động kinh doanh"
                rows={4}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Địa điểm *</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={errors.location ? "error" : ""}
                  placeholder="Thành phố, Tỉnh"
                />
                {errors.location && (
                  <span className="error-message">{errors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="established">Năm thành lập</label>
                <input
                  type="number"
                  id="established"
                  value={formData.established}
                  onChange={(e) =>
                    handleInputChange("established", parseInt(e.target.value))
                  }
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="farmSize">Quy mô trang trại *</label>
              <input
                type="text"
                id="farmSize"
                value={formData.farmSize}
                onChange={(e) => handleInputChange("farmSize", e.target.value)}
                className={errors.farmSize ? "error" : ""}
                placeholder="VD: 15 hecta, 500m²"
              />
              {errors.farmSize && (
                <span className="error-message">{errors.farmSize}</span>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-section">
            <h2>Hình ảnh trang trại</h2>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    className="remove-image-btn"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label htmlFor="image" className="upload-placeholder">
                  <FaUpload />
                  <span>Nhấp để tải lên hình ảnh</span>
                  <small>PNG, JPG tối đa 5MB</small>
                </label>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h2>Thông tin liên hệ</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPhone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  className={errors.contactPhone ? "error" : ""}
                  placeholder="0900 123 456"
                />
                {errors.contactPhone && (
                  <span className="error-message">{errors.contactPhone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">Email *</label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  className={errors.contactEmail ? "error" : ""}
                  placeholder="contact@example.com"
                />
                {errors.contactEmail && (
                  <span className="error-message">{errors.contactEmail}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactWebsite">Website (không bắt buộc)</label>
              <input
                type="url"
                id="contactWebsite"
                value={formData.contactWebsite}
                onChange={(e) =>
                  handleInputChange("contactWebsite", e.target.value)
                }
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          {/* Products */}
          <div className="form-section">
            <h2>Sản phẩm chính</h2>
            <div className="dynamic-inputs">
              {formData.products.map((product, index) => (
                <div key={index} className="dynamic-input-row">
                  <input
                    type="text"
                    value={product}
                    onChange={(e) =>
                      handleArrayInputChange("products", index, e.target.value)
                    }
                    placeholder="Tên sản phẩm"
                  />
                  <div className="dynamic-input-actions">
                    <button
                      type="button"
                      onClick={() => addArrayItem("products")}
                      className="add-btn"
                    >
                      <FaPlus />
                    </button>
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("products", index)}
                        className="remove-btn"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="form-section">
            <h2>Chứng nhận</h2>
            <div className="dynamic-inputs">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="dynamic-input-row">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) =>
                      handleArrayInputChange(
                        "certifications",
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="VD: VietGAP, Organic Vietnam"
                  />
                  <div className="dynamic-input-actions">
                    <button
                      type="button"
                      onClick={() => addArrayItem("certifications")}
                      className="add-btn"
                    >
                      <FaPlus />
                    </button>
                    {formData.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("certifications", index)}
                        className="remove-btn"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="form-section">
            <h2>Chuyên môn</h2>
            <div className="dynamic-inputs">
              {formData.specialties.map((specialty, index) => (
                <div key={index} className="dynamic-input-row">
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) =>
                      handleArrayInputChange(
                        "specialties",
                        index,
                        e.target.value,
                      )
                    }
                    placeholder="VD: Rau hữu cơ, Canh tác bền vững"
                  />
                  <div className="dynamic-input-actions">
                    <button
                      type="button"
                      onClick={() => addArrayItem("specialties")}
                      className="add-btn"
                    >
                      <FaPlus />
                    </button>
                    {formData.specialties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem("specialties", index)}
                        className="remove-btn"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Đang tạo..." : "Tạo nhà cung cấp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
