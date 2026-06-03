"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    where: {
      role: {
        not: "ADMIN"
      }
    },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      isRestricted: true
    },
    orderBy: {
      username: "asc"
    }
  });
}

export async function toggleUserRestriction(userId: string, isRestricted: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { isRestricted }
  });

  revalidatePath("/admin");
  return { success: true };
}
