import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const userId = session.user.id;

  // Xóa toàn bộ sản phẩm của shop
  await prisma.product.deleteMany({
    where: {
      shop: { ownerId: userId },
    },
  });

  // Xóa shop
  await prisma.shop.delete({
    where: { ownerId: userId },
  });

  // Cập nhật role lại NORMAL_USER
  await prisma.user.update({
    where: { id: userId },
    data: { role: "NORMAL_USER" },
  });

  // Redirect về trang chủ
  redirect("/");
}
