import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/cart/update - Update cart item quantity
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để cập nhật giỏ hàng" },
        { status: 401 },
      );
    }

    const { itemId, quantity } = await req.json();

    if (!itemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Thông tin không hợp lệ" },
        { status: 400 },
      );
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm trong giỏ hàng" },
        { status: 404 },
      );
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: quantity },
      include: {
        supplierProduct: {
          include: {
            supplier: {
              select: {
                id: true,
                name: true,
                location: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Đã cập nhật số lượng",
      item: {
        ...updatedItem,
        supplierProduct: {
          ...updatedItem.supplierProduct,
          images: updatedItem.supplierProduct.images
            ? JSON.parse(updatedItem.supplierProduct.images)
            : [],
        },
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi cập nhật số lượng" },
      { status: 500 },
    );
  }
}
