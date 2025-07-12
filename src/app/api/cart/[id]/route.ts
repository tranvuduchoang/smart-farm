import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng" },
        { status: 401 },
      );
    }

    // Check if item exists and belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm trong giỏ hàng" },
        { status: 404 },
      );
    }

    // Delete item
    await prisma.cartItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi xóa sản phẩm" },
      { status: 500 },
    );
  }
}
