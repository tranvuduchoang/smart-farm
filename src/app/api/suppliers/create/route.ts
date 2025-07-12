import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để tạo nhà cung cấp" },
        { status: 401 },
      );
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "location",
      "contactPhone",
      "contactEmail",
      "farmSize",
    ];
    for (const field of requiredFields) {
      if (!data[field] || !data[field].toString().trim()) {
        return NextResponse.json(
          { message: `Trường ${field} là bắt buộc` },
          { status: 400 },
        );
      }
    }

    // Check if user already has a supplier
    const existingSupplier = await prisma.supplier.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingSupplier) {
      return NextResponse.json(
        {
          message:
            "Bạn đã có một nhà cung cấp. Mỗi người dùng chỉ có thể có một nhà cung cấp.",
        },
        { status: 400 },
      );
    }

    // Create supplier
    const supplier = await prisma.supplier.create({
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        image: data.image || null,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactWebsite: data.contactWebsite || null,
        established: data.established || new Date().getFullYear(),
        farmSize: data.farmSize,
        products: JSON.stringify(data.products || []),
        certifications: JSON.stringify(data.certifications || []),
        specialties: JSON.stringify(data.specialties || []),
        ownerId: session.user.id,
        rating: 0,
        reviewCount: 0,
        totalProducts: 0,
        monthlyOrders: 0,
        satisfactionRate: 0,
      },
    });

    return NextResponse.json({
      message: "Nhà cung cấp đã được tạo thành công",
      supplier: {
        id: supplier.id,
        name: supplier.name,
        location: supplier.location,
      },
    });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi tạo nhà cung cấp" },
      { status: 500 },
    );
  }
}
