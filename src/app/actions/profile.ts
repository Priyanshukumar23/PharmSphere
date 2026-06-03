"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name?: string, phone?: string, address?: string }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      address: data.address,
    }
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      role: true,
      phone: true,
      address: true
    }
  });
  
  return user;
}
