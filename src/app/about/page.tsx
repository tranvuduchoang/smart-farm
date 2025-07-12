"use client";

import { useState, useEffect } from "react";
import {
  FaLeaf,
  FaHandshake,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaTruck,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import Image from "next/image";
import "./about.css";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

interface Achievement {
  year: string;
  title: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    position: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Với hơn 15 năm kinh nghiệm trong ngành nông nghiệp và công nghệ, An đã sáng lập AgriChain với tầm nhìn kết nối nông dân với người tiêu dùng.",
    social: {
      linkedin: "https://linkedin.com/in/nguyenvanan",
      twitter: "https://twitter.com/nguyenvanan",
      email: "an@agrichain.vn",
    },
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    position: "CTO",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    bio: "Chuyên gia công nghệ với kinh nghiệm phát triển các hệ thống quy mô lớn. Bình dẫn dắt đội ngũ kỹ thuật xây dựng nền tảng AgriChain.",
    social: {
      linkedin: "https://linkedin.com/in/tranthibibh",
      email: "binh@agrichain.vn",
    },
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    position: "Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Chuyên gia về chuỗi cung ứng và logistics, Cường đảm bảo mọi sản phẩm được giao đến tay khách hàng trong tình trạng tốt nhất.",
    social: {
      linkedin: "https://linkedin.com/in/levancuong",
      email: "cuong@agrichain.vn",
    },
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    position: "Head of Marketing",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "V��i niềm đam mê về nông nghiệp bền vững, Dung phụ trách việc xây dựng thương hiệu và kết nối cộng đồng AgriChain.",
    social: {
      linkedin: "https://linkedin.com/in/phamthidung",
      twitter: "https://twitter.com/phamthidung",
      email: "dung@agrichain.vn",
    },
  },
];

const achievements: Achievement[] = [
  {
    year: "2020",
    title: "Thành lập AgriChain",
    description: "Khởi động với sứ mệnh kết nối nông dân và người tiêu dùng",
  },
  {
    year: "2021",
    title: "1,000+ nông dân tham gia",
    description: "Đạt mốc 1,000 nông dân và 10,000 khách hàng đầu tiên",
  },
  {
    year: "2022",
    title: "Chứng nhận quốc tế",
    description: "Nhận chứng nhận ISO 22000 và GlobalGAP cho quy trình quản lý",
  },
  {
    year: "2023",
    title: "Mở rộng toàn quốc",
    description: "Phủ sóng 63 tỉnh thành với 500+ nông trại hợp tác",
  },
  {
    year: "2024",
    title: "25,000+ khách hàng",
    description: "Phục vụ hơn 25,000 gia đình Việt Nam với sản phẩm sạch",
  },
];

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className={`hero-title ${isVisible ? "animate-fade-in" : ""}`}>
            Về AgriChain
          </h1>
          <p className={`hero-subtitle ${isVisible ? "animate-fade-in" : ""}`}>
            Kết nối nông dân Việt Nam với thế giới thông qua công nghệ và niềm
            tin
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Nông trại</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">25,000+</span>
            <span className="stat-label">Khách hàng</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Sản phẩm</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">63</span>
            <span className="stat-label">Tỉnh thành</span>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Sứ mệnh của chúng tôi</h2>
              <p>
                AgriChain được thành lập với sứ mệnh kết nối trực tiếp nông dân
                Việt Nam với người tiêu dùng, đảm bảo sản phẩm tươi ngon, an
                toàn và có nguồn gốc rõ ràng đến tay khách hàng.
              </p>
              <p>
                Chúng tôi tin rằng công nghệ có thể giúp nông nghiệp Việt Nam
                phát triển bền vững, tạo ra giá trị cho cả nông dân và người
                tiêu dùng, đồng thời bảo vệ môi trường cho thế hệ tương lai.
              </p>
            </div>
            <div className="mission-image">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600"
                alt="Nông dân làm việc"
                width={500}
                height={400}
                className="rounded-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Giá trị cốt lõi</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3>Bền vững</h3>
              <p>
                Chúng tôi cam kết phát triển nông nghiệp bền vững, bảo vệ môi
                trường và hệ sinh thái.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaHandshake />
              </div>
              <h3>Minh bạch</h3>
              <p>
                Mọi sản phẩm đều có thể truy xuất nguồn gốc rõ ràng từ trang
                trại đến bàn ăn.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaShieldAlt />
              </div>
              <h3>Chất lượng</h3>
              <p>
                Đảm bảo chất lượng cao nhất cho mọi sản phẩm thông qua quy trình
                kiểm soát nghiêm ngặt.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <FaUsers />
              </div>
              <h3>Cộng đồng</h3>
              <p>
                Xây dựng cộng đồng nông dân và người tiêu dùng có ý thức về sản
                phẩm sạch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <div className="container">
          <h2 className="section-title">Hành trình phát triển</h2>
          <div className="timeline">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.year}
                className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{achievement.year}</div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </div>
                <div className="timeline-dot"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Đội ngũ lãnh đạo</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="member-image">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="member-photo"
                  />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-position">{member.position}</p>
                  <p className="member-bio">{member.bio}</p>
                  <div className="member-social">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTwitter />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`}>
                        <FaEnvelope />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">Tác động tích cực</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="impact-icon">
                <FaGlobe />
              </div>
              <h3>Môi trường</h3>
              <p>
                Giảm 30% khí thải carbon thông qua tối ưu hóa chuỗi cung ứng
              </p>
              <span className="impact-stat">-30% CO₂</span>
            </div>
            <div className="impact-card">
              <div className="impact-icon">
                <FaUsers />
              </div>
              <h3>Cộng đồng</h3>
              <p>Tăng thu nhập bình quân 40% cho nông dân tham gia nền tảng</p>
              <span className="impact-stat">+40% Thu nhập</span>
            </div>
            <div className="impact-card">
              <div className="impact-icon">
                <FaTruck />
              </div>
              <h3>Hiệu quả</h3>
              <p>Giảm thời gian từ thu hoạch đến người tiêu dùng còn 24 giờ</p>
              <span className="impact-stat">24h Giao hàng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Tham gia cùng chúng tôi</h2>
            <p>
              Hãy cùng AgriChain xây dựng tương lai bền vững cho nông nghiệp
              Việt Nam
            </p>
            <div className="cta-buttons">
              <button className="btn-primary">Trở thành đối tác</button>
              <button className="btn-secondary">Liên hệ với chúng tôi</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
