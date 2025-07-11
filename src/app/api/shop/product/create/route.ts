import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "SELLER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    description,
    price,
    weight,
    availability,
    delivery,
    minOrder,
    categoryId,
  } = await req.json();

  if (!name || !price || !weight || !availability || !delivery || !minOrder || !categoryId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const shop = await prisma.shop.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!shop) {
    return NextResponse.json({ error: "Bạn chưa có cửa hàng" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      weight: parseFloat(weight),
      availability,
      delivery: delivery as "TODAY" | "TOMORROW" | "SPECIFIC_DATE",
      minOrder,
      categoryId,
      reputation: 0, // default
      shopId: shop.id,
    },
  });

  return NextResponse.json({ success: true, product });
}
