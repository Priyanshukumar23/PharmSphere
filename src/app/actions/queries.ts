"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { QueryStatus } from "@prisma/client";

export async function createQuery(subject: string, message: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  return await prisma.query.create({
    data: {
      userId: (session.user as any).id,
      subject,
      message,
    }
  });
}

export async function getMyQueries() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  return await prisma.query.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" }
  });
}

export async function getAllQueries() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.query.findMany({
    include: {
      user: { select: { name: true, username: true, role: true } }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function resolveQuery(queryId: string, response: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");

  return await prisma.query.update({
    where: { id: queryId },
    data: {
      response,
      status: "RESOLVED"
    }
  });
}
