import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Users
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Admin User",
      username: "admin",
      passwordHash: "password123", // Storing as plaintext just for demo simplicity
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "seller" },
    update: {},
    create: {
      name: "Seller User",
      username: "seller",
      passwordHash: "password123",
      role: "SELLER",
    },
  });

  // Seed Products
  const sellerUser = await prisma.user.findUnique({ where: { username: "seller" } });
  if (!sellerUser) throw new Error("Seller not found");

  await prisma.product.upsert({
    where: { sku: "SKU-RICE" },
    update: {},
    create: {
      name: "Premium Basmati Rice",
      sku: "SKU-RICE",
      dimension: "MASS",
      symptoms: "hunger",
      sellerId: sellerUser.id,
      pricePerBaseUnit: 0.05, // 50 INR per kg = 0.05 per g
      stockInBaseUnit: 100000, // 100 kg
    },
  });

  await prisma.product.upsert({
    where: { sku: "SKU-WATER" },
    update: {},
    create: {
      name: "Distilled Water",
      sku: "SKU-WATER",
      dimension: "VOLUME",
      symptoms: "dehydration, thirst",
      sellerId: sellerUser.id,
      pricePerBaseUnit: 0.02, // 20 INR per L = 0.02 per mL
      stockInBaseUnit: 50000, // 50 L
    },
  });

  await prisma.product.upsert({
    where: { sku: "SKU-PARA" },
    update: {},
    create: {
      name: "Paracetamol 500mg",
      sku: "SKU-PARA",
      dimension: "COUNT",
      symptoms: "fever, headache, pain",
      sellerId: sellerUser.id,
      pricePerBaseUnit: 5.00, // 5 INR per item
      stockInBaseUnit: 10000, // 10k items
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
