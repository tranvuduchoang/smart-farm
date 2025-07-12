export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  seller: string;
  location: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  organic: boolean;
  fresh: boolean;
  discount?: number;
  unit: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const marketplaceProducts: Product[] = [
  {
    id: "1",
    name: "Cà chua hữu cơ Đà Lạt",
    price: 45000,
    originalPrice: 55000,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1546470427-e8c72c1dc78f?w=400",
    description: "Cà chua tươi ngon, hữu cơ 100% từ nông trại Đà Lạt. Không sử dụng thuốc tr��� sâu, giàu vitamin C và lycopene.",
    seller: "Nông trại Hoa Đà Lạt",
    location: "Đà Lạt, Lâm Đồng",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    organic: true,
    fresh: true,
    discount: 18,
    unit: "kg"
  },
  {
    id: "2",
    name: "Xoài cát Hòa Lộc",
    price: 120000,
    category: "fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
    description: "Xoài cát Hòa Lộc chính gốc Tiền Giang, thịt dày, ngọt thanh, thơm đậm đà. Trái to đều, không tẩm hóa chất.",
    seller: "HTX Xoài Hòa Lộc",
    location: "Tiền Giang",
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    organic: true,
    fresh: true,
    unit: "kg"
  },
  {
    id: "3",
    name: "Thịt bò Wagyu A5",
    price: 850000,
    originalPrice: 950000,
    category: "meats",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    description: "Thịt bò Wagyu A5 chất lượng cao, thịt mềm, mùi vị đậm đà. Nuôi theo tiêu chuẩn Nhật Bản.",
    seller: "Trang trại Wagyu Việt",
    location: "Bình Dương",
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    organic: false,
    fresh: true,
    discount: 11,
    unit: "kg"
  },
  {
    id: "4",
    name: "Sữa tươi organic Vinamilk",
    price: 28000,
    category: "dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
    description: "Sữa tươi organic từ bò nuôi thả tự nhiên, không hormone tăng trưởng, giàu protein và canxi.",
    seller: "Vinamilk Organic",
    location: "Nghệ An",
    rating: 4.6,
    reviewCount: 156,
    inStock: true,
    organic: true,
    fresh: true,
    unit: "lít"
  },
  {
    id: "5",
    name: "Bánh mì nguyên cám",
    price: 35000,
    category: "breads",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    description: "Bánh mì nguyên cám tự nhiên, không chất bảo quản, giàu chất xơ, tốt cho sức khỏe.",
    seller: "Tiệm bánh Organic House",
    location: "TP.HCM",
    rating: 4.5,
    reviewCount: 78,
    inStock: true,
    organic: true,
    fresh: true,
    unit: "ổ"
  },
  {
    id: "6",
    name: "Tôm sú tươi sống",
    price: 320000,
    originalPrice: 380000,
    category: "seafood",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5573b07?w=400",
    description: "Tôm sú tươi sống từ trang trại nuôi ở Cà Mau, size 20-25 con/kg, thịt chắc ngọt.",
    seller: "Trang trại tôm Minh Phú",
    location: "Cà Mau",
    rating: 4.8,
    reviewCount: 67,
    inStock: true,
    organic: false,
    fresh: true,
    discount: 16,
    unit: "kg"
  },
  {
    id: "7",
    name: "Rượu vang đỏ Đà Lạt",
    price: 380000,
    category: "wines",
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400",
    description: "Rượu vang đỏ từ nho trồng tại Đà Lạt, hương vị thơm ngon, độ cồn 12.5%.",
    seller: "Vang Đà Lạt Wine",
    location: "Đà Lạt, Lâm Đồng",
    rating: 4.4,
    reviewCount: 34,
    inStock: true,
    organic: true,
    fresh: false,
    unit: "chai"
  },
  {
    id: "8",
    name: "Rau cải ngọt hữu cơ",
    price: 25000,
    category: "vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
    description: "Rau cải ngọt tươi, trồng theo phương pháp hữu cơ, không thuốc trừ sâu.",
    seller: "Nông trại xanh Mekong",
    location: "An Giang",
    rating: 4.7,
    reviewCount: 92,
    inStock: true,
    organic: true,
    fresh: true,
    unit: "bó"
  }
];

export const productCategories: ProductCategory[] = [
  { id: "fruits", name: "Trái cây", slug: "fruits", count: 156 },
  { id: "vegetables", name: "Rau củ", slug: "vegetables", count: 234 },
  { id: "meats", name: "Thịt", slug: "meats", count: 89 },
  { id: "seafood", name: "Hải sản", slug: "seafood", count: 67 },
  { id: "dairy", name: "Sữa", slug: "dairy", count: 45 },
  { id: "breads", name: "Bánh mì", slug: "breads", count: 23 },
  { id: "wines", name: "Rượu vang", slug: "wines", count: 34 }
];

export const filters = {
  priceRanges: [
    { id: "under-50k", label: "Dưới 50,000đ", min: 0, max: 50000 },
    { id: "50k-100k", label: "50,000đ - 100,000đ", min: 50000, max: 100000 },
    { id: "100k-300k", label: "100,000đ - 300,000đ", min: 100000, max: 300000 },
    { id: "over-300k", label: "Trên 300,000đ", min: 300000, max: Infinity }
  ],
  locations: ["TP.HCM", "Hà Nội", "Đà Lạt", "An Giang", "Cà Mau", "Tiền Giang", "Bình Dương", "Nghệ An"]
};
