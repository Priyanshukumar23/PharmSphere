"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function signupUser(formData: FormData) {
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  if (!name || !username || !password || !role) {
    throw new Error("Missing required fields");
  }

  const existingUser = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUser) {
    throw new Error("Username already taken");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      role
    }
  });

  return { success: true };
}
