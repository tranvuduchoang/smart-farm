import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Định nghĩa các kiểu dữ liệu Availability và Delivery
type Availability = "IN_STOCK" | "LIMITED_STOCK";
type Delivery = "TODAY" | "TOMORROW" | "SPECIFIC_DATE";

export async function POST(req: Request) {
  // Lấy thông tin session từ next-auth
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Xử lý việc tải lên các hình ảnh
    const formData = await req.formData();  // Sử dụng FormData để lấy dữ liệu

    // Lấy các trường dữ liệu từ formData
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const weight = formData.get("weight") as string;
    const availability = formData.get("availability") as Availability;
    const delivery = formData.get("delivery") as Delivery;
    const minOrder = formData.get("minOrder") as string;
    const categoryId = formData.get("categoryId") as string;

    // Kiểm tra các trường bắt buộc
    if (!name || !price || !weight || !availability || !delivery || !minOrder || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Tìm cửa hàng của người dùng
    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!shop) {
      return new NextResponse("Bạn chưa có cửa hàng", { status: 400 });
    }

    // Xử lý hình ảnh (nếu có)
    const images = formData.getAll("images");  // Get all images as FileList

    const imageUrls = images.map((image: any) => {
      // Lưu hình ảnh vào thư mục công khai và trả về URL của ảnh
      const filename = `${Date.now()}-${image.name}`;
      const filePath = `public/uploads/${filename}`;

      // Lưu hình ảnh vào thư mục công khai (bạn cần xử lý logic lưu trữ tệp vào thư mục)
      // fs.writeFileSync(filePath, image); // Nếu dùng file hệ thống

      return `/uploads/${filename}`;  // Trả về đường dẫn ảnh
    });

    // Tạo sản phẩm mới
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        weight: parseFloat(weight),
        availability,
        delivery,
        minOrder,
        categoryId,
        reputation: 0, // Default
        shopId: shop.id,
        images: {
          create: imageUrls.map((url) => ({
            url,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
