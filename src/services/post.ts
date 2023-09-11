import { db } from "../lib/prisma";

export async function addPost(userId: number, post: {
  title: string;
  description: string;
}) {
  return await db.post.create({
    data: {
      ...post,
      createdById: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

export async function getPostById(postId: number) {
  return await db.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

export async function deletePostById(postId: number) {
  return await db.post.delete({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

export async function editPost(postId: number, updatedPost: {
  title: string;
  description: string;
}) {
  return await db.post.update({
    where: {
      id: postId,
    },
    data: updatedPost,
    select: {
      id: true,
      title: true,
      description: true,
    },
  });
}

export async function searchPosts(query: string) {
  return await db.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
    },
    take: 50,
  });
}
