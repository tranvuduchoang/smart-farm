import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  console.log("Product ID:", productId); // Log ID để kiểm tra

  if (!productId) {
    return new Response(
      JSON.stringify({ error: "Product ID is missing" }),
      { status: 400 }
    );
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "upload");
    fs.mkdirSync(uploadDir, { recursive: true });

    // Xóa tất cả ảnh liên quan trước
    await prisma.image.deleteMany({
      where: { productId },
    });

    // Xóa sản phẩm
    await prisma.product.delete({
      where: { id: productId },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete product" }),
      { status: 500 }
    );
  }
}
