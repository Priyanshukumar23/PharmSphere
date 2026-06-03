"use server";

import { prisma } from "@/lib/prisma";
import { Dimension } from "@/lib/units";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getProducts(search?: string, minPrice?: number, maxPrice?: number) {
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { symptoms: { contains: search, mode: "insensitive" } }
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.pricePerBaseUnit = {};
    if (minPrice !== undefined) whereClause.pricePerBaseUnit.gte = minPrice;
    if (maxPrice !== undefined) whereClause.pricePerBaseUnit.lte = maxPrice;
  }

  return await prisma.product.findMany({
    where: whereClause
  });
}

export async function createProduct(name: string, sku: string, dimension: Dimension, symptoms: string, pricePerBaseUnit: number, stockInBaseUnit: number, imageUrl?: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !["ADMIN", "SELLER"].includes((session.user as any).role)) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (user?.isRestricted) {
    throw new Error("Your account has been restricted from adding products.");
  }

  return await prisma.product.create({
    data: {
      name,
      sku,
      dimension,
      symptoms,
      imageUrl,
      sellerId: (session.user as any).id,
      pricePerBaseUnit,
      stockInBaseUnit
    }
  });
}

export async function getMyProducts() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "SELLER") throw new Error("Unauthorized");

  return await prisma.product.findMany({
    where: { sellerId: (session.user as any).id }
  });
}

export async function getMySales() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "SELLER") throw new Error("Unauthorized");

  return await prisma.orderItem.findMany({
    where: {
      product: { sellerId: (session.user as any).id }
    },
    include: { product: true, order: { select: { createdAt: true, status: true } } },
    orderBy: { order: { createdAt: "desc" } }
  });
}

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      },
      user: {
        select: { username: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateProduct(productId: string, data: { name: string, sku: string, dimension: Dimension, symptoms: string, pricePerBaseUnit: number, stockInBaseUnit: number, imageUrl?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "SELLER") {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (user?.isRestricted) {
    throw new Error("Your account has been restricted from modifying products.");
  }

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.sellerId !== (session.user as any).id) {
    throw new Error("Product not found or unauthorized");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      sku: data.sku,
      dimension: data.dimension,
      symptoms: data.symptoms,
      pricePerBaseUnit: data.pricePerBaseUnit,
      stockInBaseUnit: data.stockInBaseUnit,
      imageUrl: data.imageUrl
    }
  });

  revalidatePath("/seller");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role !== "SELLER") {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.sellerId !== (session.user as any).id) {
    throw new Error("Product not found or unauthorized");
  }

  await prisma.product.delete({
    where: { id: productId }
  });

  revalidatePath("/seller");
  return { success: true };
}
