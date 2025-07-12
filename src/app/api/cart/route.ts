import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/cart - Get user's cart items
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để xem giỏ hàng" },
        { status: 401 },
      );
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Parse JSON fields
    const formattedItems = cartItems.map((item) => ({
      ...item,
      supplierProduct: {
        ...item.supplierProduct,
        images: item.supplierProduct.images
          ? JSON.parse(item.supplierProduct.images)
          : [],
      },
    }));

    return NextResponse.json({
      items: formattedItems,
      count: cartItems.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi tải giỏ hàng" },
      { status: 500 },
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Bạn cần đăng nhập để thêm vào giỏ hàng" },
        { status: 401 },
      );
    }

    const { supplierProductId, quantity = 1 } = await req.json();

    if (!supplierProductId) {
      return NextResponse.json(
        { message: "Thiếu thông tin sản phẩm" },
        { status: 400 },
      );
    }

    // Check if product exists
    const product = await prisma.supplierProduct.findUnique({
      where: { id: supplierProductId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        supplierProductId: supplierProductId,
      },
    });

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
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
        message: "Đã cập nhật số lượng trong giỏ hàng",
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
    } else {
      // Create new cart item
      const newItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          supplierProductId: supplierProductId,
          quantity: quantity,
        },
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
        message: "Đã thêm sản phẩm vào giỏ hàng",
        item: {
          ...newItem,
          supplierProduct: {
            ...newItem.supplierProduct,
            images: newItem.supplierProduct.images
              ? JSON.parse(newItem.supplierProduct.images)
              : [],
          },
        },
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi thêm vào giỏ hàng" },
      { status: 500 },
    );
  }
}
