import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/suppliers/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        supplierProducts: {
          include: {
            category: true,
          },
        },
        orders: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            items: {
              include: {
                supplierProduct: {
                  select: {
                    name: true,
                    unit: true,
                  },
                },
              },
            },
          },
          orderBy: {
            orderedAt: "desc",
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { message: "Không tìm thấy nhà cung cấp" },
        { status: 404 },
      );
    }

    // Parse JSON fields
    const supplierData = {
      ...supplier,
      products: supplier.products ? JSON.parse(supplier.products) : [],
      certifications: supplier.certifications
        ? JSON.parse(supplier.certifications)
        : [],
      specialties: supplier.specialties ? JSON.parse(supplier.specialties) : [],
      supplierProducts: supplier.supplierProducts.map((product) => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
      })),
    };

    return NextResponse.json(supplierData);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi tải thông tin nhà cung cấp" },
      { status: 500 },
    );
  }
}

// PUT /api/suppliers/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để chỉnh sửa thông tin" },
        { status: 401 },
      );
    }

    const data = await req.json();

    // Check if supplier exists and user is owner
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: { owner: true },
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { message: "Không tìm thấy nhà cung cấp" },
        { status: 404 },
      );
    }

    if (existingSupplier.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Bạn không có quyền chỉnh sửa nhà cung cấp này" },
        { status: 403 },
      );
    }

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

    // Update supplier
    const updatedSupplier = await prisma.supplier.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
        contactWebsite: data.contactWebsite || null,
        farmSize: data.farmSize,
        products: JSON.stringify(data.products || []),
        certifications: JSON.stringify(data.certifications || []),
        specialties: JSON.stringify(data.specialties || []),
      },
    });

    return NextResponse.json({
      message: "Thông tin nhà cung cấp đã được cập nhật thành công",
      supplier: updatedSupplier,
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi cập nhật thông tin" },
      { status: 500 },
    );
  }
}

// DELETE /api/suppliers/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để xóa nhà cung cấp" },
        { status: 401 },
      );
    }

    // Check if supplier exists and user is owner
    const existingSupplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: { owner: true },
    });

    if (!existingSupplier) {
      return NextResponse.json(
        { message: "Không tìm thấy nhà cung cấp" },
        { status: 404 },
      );
    }

    if (existingSupplier.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Bạn không có quyền xóa nhà cung cấp này" },
        { status: 403 },
      );
    }

    // Check if supplier has pending orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        supplierId: params.id,
        status: {
          in: ["PENDING", "CONFIRMED", "SHIPPED"],
        },
      },
    });

    if (pendingOrders.length > 0) {
      return NextResponse.json(
        { message: "Không thể xóa nhà cung cấp khi còn đơn hàng đang xử lý" },
        { status: 400 },
      );
    }

    // Delete supplier (this will cascade delete products and orders)
    await prisma.supplier.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Nhà cung cấp đã được xóa thành công",
    });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi xóa nhà cung cấp" },
      { status: 500 },
    );
  }
}
