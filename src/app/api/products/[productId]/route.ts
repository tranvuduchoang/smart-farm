import prisma from "@/lib/prisma"; // Prisma client

export async function GET(req: Request, props: { params: Promise<{ productId: string }> }) {
    const params = await props.params;
    const { productId } = params;

    // Truy vấn sản phẩm từ database dựa trên productId
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: true }, // Lấy hình ảnh của sản phẩm
    });

    if (!product) {
        return new Response("Product not found", { status: 404 });
    }

    return new Response(JSON.stringify(product), { status: 200 });
}
