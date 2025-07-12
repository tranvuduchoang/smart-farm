export interface Supplier {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  products: string[];
  certifications: string[];
  established: number;
  farmSize: string;
  specialties: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  stats: {
    totalProducts: number;
    monthlyOrders: number;
    satisfactionRate: number;
  };
}

export const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Nông trại Hoa Đà Lạt",
    description: "Trang trại gia đình với hơn 20 năm kinh nghiệm trồng rau củ hữu cơ tại Đà Lạt. Chúng tôi cam kết cung cấp những sản phẩm tươi ngon nhất với chất lượng đảm bảo.",
    location: "Đà Lạt, Lâm Đồng",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
    rating: 4.8,
    reviewCount: 234,
    products: ["Cà chua", "Rau cải", "Củ cải", "Bông cải xanh", "Dưa chuột"],
    certifications: ["VietGAP", "Organic Vietnam", "GlobalGAP"],
    established: 2003,
    farmSize: "15 hecta",
    specialties: ["Rau hữu cơ", "Canh tác bền vững", "Sản phẩm tươi"],
    contactInfo: {
      phone: "0908 123 456",
      email: "contact@hoadalat.vn",
      website: "www.hoadalat.vn"
    },
    stats: {
      totalProducts: 45,
      monthlyOrders: 1200,
      satisfactionRate: 98
    }
  },
  {
    id: "2",
    name: "HTX Xoài Hòa Lộc",
    description: "Hợp tác xã chuyên canh xoài cát Hòa Lộc với quy mô 200 thành viên. Sản phẩm được xuất khẩu sang nhiều nước trên thế giới.",
    location: "Tiền Giang",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
    rating: 4.9,
    reviewCount: 156,
    products: ["Xoài cát Hòa Lộc", "Xoài Thái", "Nhãn", "Mít"],
    certifications: ["VietGAP", "Organic", "Fair Trade"],
    established: 1998,
    farmSize: "500 hecta",
    specialties: ["Xoài xuất khẩu", "Trái cây nhiệt đới", "Chế biến sau thu hoạch"],
    contactInfo: {
      phone: "0907 234 567",
      email: "htx@xoaihoaloc.vn"
    },
    stats: {
      totalProducts: 12,
      monthlyOrders: 800,
      satisfactionRate: 99
    }
  },
  {
    id: "3",
    name: "Trang trại Wagyu Việt",
    description: "Trang trại chăn nuôi bò Wagyu đầu tiên tại Việt Nam, áp dụng công nghệ và quy trình chăn nuôi hiện đại theo tiêu chuẩn Nhật Bản.",
    location: "Bình Dương",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600",
    rating: 4.7,
    reviewCount: 89,
    products: ["Thịt bò Wagyu A5", "Thịt bò Wagyu A4", "Sữa bò Wagyu"],
    certifications: ["HACCP", "ISO 22000", "JAS Organic"],
    established: 2015,
    farmSize: "50 hecta",
    specialties: ["Bò Wagyu", "Chăn nuôi cao cấp", "Tiêu chuẩn Nhật Bản"],
    contactInfo: {
      phone: "0906 345 678",
      email: "info@wagyuviet.com",
      website: "www.wagyuviet.com"
    },
    stats: {
      totalProducts: 8,
      monthlyOrders: 150,
      satisfactionRate: 96
    }
  },
  {
    id: "4",
    name: "Trang trại tôm Minh Phú",
    description: "Công ty nuôi trồng và chế biến thủy sản hàng đầu Việt Nam, chuyên nuôi tôm sú và tôm thẻ chân tr���ng theo tiêu chuẩn quốc tế.",
    location: "Cà Mau",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
    rating: 4.6,
    reviewCount: 123,
    products: ["Tôm sú", "Tôm thẻ chân trắng", "Cua biển", "Cá tra"],
    certifications: ["BAP", "ASC", "BRC", "IFS"],
    established: 2005,
    farmSize: "1000 hecta",
    specialties: ["Tôm xuất khẩu", "Nuôi trồng thủy sản", "Chế biến đông lạnh"],
    contactInfo: {
      phone: "0905 456 789",
      email: "export@minhphu.com",
      website: "www.minhphu.com"
    },
    stats: {
      totalProducts: 15,
      monthlyOrders: 2000,
      satisfactionRate: 94
    }
  },
  {
    id: "5",
    name: "Nông trại xanh Mekong",
    description: "Trang trại rau sạch quy mô lớn tại vùng ĐBSCL, chuyên cung cấp rau củ quả tươi sạch cho thị trường trong nước và xuất khẩu.",
    location: "An Giang",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600",
    rating: 4.8,
    reviewCount: 167,
    products: ["Cải ngọt", "Rau muống", "Khổ qua", "Đậu bắp", "Mướp"],
    certifications: ["VietGAP", "Organic", "USDA Organic"],
    established: 2010,
    farmSize: "80 hecta",
    specialties: ["Rau sạch", "Hệ thống thủy canh", "Xuất khẩu"],
    contactInfo: {
      phone: "0904 567 890",
      email: "info@mekongfarm.vn"
    },
    stats: {
      totalProducts: 35,
      monthlyOrders: 900,
      satisfactionRate: 97
    }
  },
  {
    id: "6",
    name: "Vinamilk Organic",
    description: "Đơn vị chuyên sản xuất các sản phẩm sữa organic chất lượng cao từ đàn bò được nuôi trong môi trường tự nhiên hoàn toàn.",
    location: "Nghệ An",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600",
    rating: 4.5,
    reviewCount: 234,
    products: ["Sữa tươi organic", "Sữa chua organic", "Phô mai organic"],
    certifications: ["EU Organic", "USDA Organic", "JAS Organic"],
    established: 2012,
    farmSize: "200 hecta",
    specialties: ["Sữa organic", "Chăn nuôi bò sữa", "Quy trình sạch"],
    contactInfo: {
      phone: "0903 678 901",
      email: "organic@vinamilk.com.vn",
      website: "www.vinamilk.com.vn"
    },
    stats: {
      totalProducts: 18,
      monthlyOrders: 3000,
      satisfactionRate: 95
    }
  }
];
