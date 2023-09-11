import { db } from "../lib/prisma";
import { password } from "bun";

export async function signUpUser(user: {
  username: string;
  password: string;
}) {
  return await db.user.create({
    data: {
      ...user,
      password: await password.hash(user.password),
    },
    select: {
      id: true,
      username: true,
    },
  });
}

export async function getProfile(username: string) {
  return await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
    },
  });
}

export async function getUsers(search: string) {
  return await db.user.findMany({
    where: {
      username: {
        contains: search,
      },
    },
    select: {
      id: true,
      username: true,
    },
    take: 50,
  });
}
