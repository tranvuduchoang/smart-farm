import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "NORMAL_USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();

  try {
    // Kiểm tra shop đã tồn tại
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: "Bạn đã có cửa hàng rồi" },
        { status: 400 }
      );
    }

    // Tạo shop
    const shop = await prisma.shop.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
      },
    });
    // 👉 Cập nhật role
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "SELLER" },
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json({ error: "Tạo cửa hàng thất bại" }, { status: 500 });
  }
}
