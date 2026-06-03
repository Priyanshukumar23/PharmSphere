"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitQuery(subject: string, message: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  await prisma.query.create({
    data: {
      userId,
      subject,
      message,
    }
  });

  revalidatePath("/buyer");
  revalidatePath("/seller");
  return { success: true };
}

export async function replyToQuery(queryId: string, response: string) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.query.update({
    where: { id: queryId },
    data: {
      response,
      status: "RESOLVED"
    }
  });

  revalidatePath("/admin");
  return { success: true };
}
