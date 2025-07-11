import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    "Fruits",
    "Vegetables",
    "Meats",
    "Breads",
    "Dairy",
    "Seafood",
    "Wines",
  ];

  for (const name of categories) {
    await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
  }

  console.log("✅ Seeded categories!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
