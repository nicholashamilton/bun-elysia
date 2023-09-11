import { db } from "../lib/prisma";

export async function signUpUser(user: {
  username: string;
  password: string;
}) {
  return await db.user.create({
    data: user,
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
