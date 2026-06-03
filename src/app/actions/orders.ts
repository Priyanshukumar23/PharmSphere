"use server";

import { prisma } from "@/lib/prisma";
import { Dimension, DisplayUnit, toBaseQuantity, calculateTotal } from "@/lib/units";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Decimal } from "decimal.js";

export async function createOrder(productId: string, requestedQuantity: number, requestedUnit: DisplayUnit) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const baseQty = toBaseQuantity(requestedQuantity, requestedUnit);
  const totalInr = calculateTotal(baseQty, product.pricePerBaseUnit as any);

  if (baseQty.greaterThan(product.stockInBaseUnit as any)) {
    throw new Error("Insufficient stock");
  }

  const order = await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: productId },
      data: {
        stockInBaseUnit: {
          decrement: baseQty,
        }
      }
    });

    const newOrder = await tx.order.create({
      data: {
        userId: (session.user as any).id,
        status: "QUOTE",
        totalAmountInr: totalInr,
        items: {
          create: {
            productId,
            requestedDisplayQuantity: requestedQuantity,
            requestedDisplayUnit: requestedUnit,
            baseQuantity: baseQty,
            pricePerBaseUnitAtTime: product.pricePerBaseUnit,
            itemTotalInr: totalInr,
          }
        }
      },
      include: { items: true }
    });

    return newOrder;
  });

  return order;
}

export async function calculateQuote(productId: string, requestedQuantity: number, requestedUnit: DisplayUnit) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  const baseQty = toBaseQuantity(requestedQuantity, requestedUnit);
  const totalInr = calculateTotal(baseQty, product.pricePerBaseUnit as any);

  return {
    baseQty: baseQty.toString(),
    totalInr: totalInr.toString(),
    pricePerBaseUnit: product.pricePerBaseUnit.toString(),
  };
}

export async function getMyOrders() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  return await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createCheckoutOrder(
  cartItems: { productId: string, requestedQuantity: number, requestedUnit: DisplayUnit }[],
  paymentMethod: "UPI" | "COD"
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (user?.isRestricted) {
    throw new Error("Your account has been restricted from purchasing.");
  }

  let totalAmountInr = new Decimal(0);
  const itemsToCreate = [];
  const productUpdates = [];

  for (const item of cartItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    const baseQty = toBaseQuantity(item.requestedQuantity, item.requestedUnit);
    const itemTotalInr = calculateTotal(baseQty, product.pricePerBaseUnit as any);

    if (baseQty.greaterThan(product.stockInBaseUnit as any)) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    totalAmountInr = totalAmountInr.add(itemTotalInr);

    itemsToCreate.push({
      productId: item.productId,
      requestedDisplayQuantity: item.requestedQuantity,
      requestedDisplayUnit: item.requestedUnit,
      baseQuantity: baseQty,
      pricePerBaseUnitAtTime: product.pricePerBaseUnit,
      itemTotalInr: itemTotalInr,
    });

    productUpdates.push({
      id: item.productId,
      decrement: baseQty,
    });
  }

  const paymentStatus = paymentMethod === "UPI" ? "PAID" : "PENDING";
  const orderStatus = "CONFIRMED";

  const order = await prisma.$transaction(async (tx) => {
    for (const update of productUpdates) {
      await tx.product.update({
        where: { id: update.id },
        data: { stockInBaseUnit: { decrement: update.decrement } }
      });
    }

    return await tx.order.create({
      data: {
        userId: (session.user as any).id,
        status: orderStatus,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        totalAmountInr: totalAmountInr,
        items: {
          create: itemsToCreate
        }
      },
      include: { items: true }
    });
  });

  return order;
}

export async function cancelOrder(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } }
  });

  if (!order) throw new Error("Order not found");
  if (order.userId !== (session.user as any).id) throw new Error("Unauthorized");
  
  if (order.status !== "QUOTE" && order.status !== "CONFIRMED") {
    throw new Error("Order cannot be cancelled at this stage");
  }

  await prisma.$transaction(async (tx) => {
    // 1. Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    });

    // 2. Restore stock for each item & create notification for seller
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockInBaseUnit: { increment: item.baseQuantity } }
      });

      // Notification for seller
      await tx.query.create({
        data: {
          userId: item.product.sellerId,
          subject: `Order Cancelled: ${orderId.substring(0, 8)}`,
          message: `Buyer ${(session.user as any).username} cancelled their order containing ${item.product.name}. Stock has been restored.`,
        }
      });
    }
  });

  return { success: true };
}
