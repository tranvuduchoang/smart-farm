"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaGift,
  FaCheck,
  FaStar,
  FaLeaf,
  FaTruck,
  FaBell,
} from "react-icons/fa";
import "./offers.css";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  interests: string[];
  newsletter: boolean;
  sms: boolean;
}

const offerCategories = [
  { id: "fruits", name: "Trái cây tươi", icon: "🍎" },
  { id: "vegetables", name: "Rau củ hữu cơ", icon: "🥬" },
  { id: "meats", name: "Thịt sạch", icon: "🥩" },
  { id: "seafood", name: "Hải sản tươi sống", icon: "🦐" },
  { id: "dairy", name: "Sữa & Chế phẩm", icon: "🥛" },
  { id: "breads", name: "Bánh mì & Ngũ cốc", icon: "🍞" },
];

const benefits = [
  {
    icon: <FaGift />,
    title: "Ưu đãi độc quyền",
    description: "Nhận giảm giá lên đến 30% cho đơn hàng đầu tiên",
  },
  {
    icon: <FaBell />,
    title: "Thông báo sớm",
    description:
      "Được thông báo đầu tiên về sản phẩm mới và chương trình khuyến mãi",
  },
  {
    icon: <FaLeaf />,
    title: "Sản phẩm premium",
    description: "Ưu tiên truy cập vào các sản phẩm hữu cơ cao cấp",
  },
  {
    icon: <FaTruck />,
    title: "Miễn phí giao hàng",
    description: "Giao hàng miễn phí cho đơn hàng trên 200,000đ",
  },
];

const testimonials = [
  {
    name: "Chị Lan Anh",
    location: "Hà Nội",
    rating: 5,
    comment:
      "Nhờ đăng ký nhận ưu đãi, tôi đã tiết kiệm được hàng triệu đồng mỗi tháng cho gia đình!",
  },
  {
    name: "Anh Minh",
    location: "TP.HCM",
    rating: 5,
    comment:
      "Sản phẩm luôn tươi ngon, giá cả hợp lý. Dịch vụ chăm sóc khách hàng rất tốt.",
  },
  {
    name: "Cô Hương",
    location: "Đà Nẵng",
    rating: 5,
    comment:
      "Từ khi đăng ký, tôi luôn được ưu tiên những sản phẩm chất lượng nhất.",
  },
];

export default function OffersPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    interests: [],
    newsletter: true,
    sms: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestChange = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(categoryId)
        ? prev.interests.filter((id) => id !== categoryId)
        : [...prev.interests, categoryId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="offers-page">
        <div className="success-container">
          <div className="success-content">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h1>Đăng ký thành công!</h1>
            <p>
              Cảm ơn bạn đã đăng ký nhận ưu đãi từ AgriChain. Chúng tôi sẽ gửi
              các chương trình khuyến mãi tốt nhất đến email của bạn.
            </p>
            <div className="next-steps">
              <h3>Điều gì sẽ xảy ra tiếp theo?</h3>
              <ul>
                <li>✅ Bạn sẽ nhận email xác nhận trong vòng 5 phút</li>
                <li>✅ Mã giảm giá 20% sẽ được gửi ngay lập tức</li>
                <li>✅ Những ưu đãi độc quyền sẽ được gửi hàng tuần</li>
              </ul>
            </div>
            <div className="success-actions">
              <button
                className="btn-primary"
                onClick={() => (window.location.href = "/marketplace")}
              >
                Khám phá sản phẩm
              </button>
              <button
                className="btn-secondary"
                onClick={() => setIsSubmitted(false)}
              >
                Đăng ký thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      {/* Hero Section */}
      <section className="offers-hero">
        <div className="hero-content">
          <h1>Đăng ký nhận ưu đãi đặc biệt</h1>
          <p>
            Tham gia cộng đồng AgriChain để nhận những ưu đãi độc quyền, sản
            phẩm mới và chương trình khuyến mãi hấp dẫn
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">25,000+</span>
              <span className="stat-label">Thành viên</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">30%</span>
              <span className="stat-label">Tiết kiệm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Hỗ trợ</span>
            </div>
          </div>
        </div>
      </section>

      <div className="offers-content">
        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <h2>Quyền lợi thành viên</h2>
            <div className="benefits-grid">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="registration-section">
          <div className="container">
            <div className="registration-grid">
              <div className="form-container">
                <h2>Đăng ký ngay hôm nay</h2>
                <p>Chỉ mất 2 phút để tham gia cộng đồng AgriChain</p>

                <form onSubmit={handleSubmit} className="registration-form">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <FaUser />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0xxx xxx xxx"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      <FaMapMarkerAlt />
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Thành phố, Quận/Huyện"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sản phẩm quan tâm</label>
                    <div className="interests-grid">
                      {offerCategories.map((category) => (
                        <label key={category.id} className="interest-option">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(category.id)}
                            onChange={() => handleInterestChange(category.id)}
                          />
                          <span className="interest-card">
                            <span className="interest-icon">
                              {category.icon}
                            </span>
                            <span className="interest-name">
                              {category.name}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Tùy chọn nhận thông báo</label>
                    <div className="notification-options">
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        Nhận email về ưu đãi và sản phẩm mới
                      </label>
                      <label className="checkbox-option">
                        <input
                          type="checkbox"
                          name="sms"
                          checked={formData.sms}
                          onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        Nhận SMS về các chương trình khuyến mãi hot
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`submit-btn ${isLoading ? "loading" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Đăng ký nhận ưu đãi"}
                  </button>

                  <p className="form-note">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <a href="/terms">Điều khoản sử dụng</a> và{" "}
                    <a href="/privacy">Chính sách bảo mật</a> của chúng tôi.
                  </p>
                </form>
              </div>

              <div className="testimonials-container">
                <h3>Khách hàng nói gì về AgriChain</h3>
                <div className="testimonials-list">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                      <div className="stars">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <p>"{testimonial.comment}"</p>
                      <div className="testimonial-author">
                        <strong>{testimonial.name}</strong>
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Còn chần chừ gì nữa?</h2>
              <p>
                Hàng nghìn khách hàng đã tin tưởng và tiết kiệm hàng triệu đồng
                mỗi tháng. Hãy tham gia ngay hôm nay!
              </p>
              <div className="cta-features">
                <div className="feature-item">
                  <FaGift />
                  <span>Mã giảm giá 20% ngay lập tức</span>
                </div>
                <div className="feature-item">
                  <FaTruck />
                  <span>Miễn phí giao hàng đơn đầu tiên</span>
                </div>
                <div className="feature-item">
                  <FaLeaf />
                  <span>Sản phẩm hữu cơ chất lượng cao</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
