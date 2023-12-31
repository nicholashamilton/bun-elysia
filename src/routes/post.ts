import { Elysia, t } from 'elysia';
import { addPost, deletePostById, editPost, getPostById, searchPosts } from '../services/post';

const publicPost = t.Object({
  title: t.String({
    minLength: 2
  }),
  description: t.String({
    minLength: 4
  }),
});

const publicPosts = t.Array(publicPost);

const postModel = {
  publicPost,
  publicPosts,
};

export const postRoutes = new Elysia({ prefix: '/post' })

  .model(postModel)

  /**
   * Add a new post.
   */
  .post(
    '/',
    async ({ body }) => addPost(2, body),
    {
      body: 'publicPost',
      response: 'publicPost',
    }
  )

  /**
   * Get a post by its ID.
   */
  .get(
    '/:id',
    async ({ params }) => {
      const post = await getPostById(parseInt(params.id));
      if (!post) throw { code: 'NOT_FOUND' };
      return post;
    },
    {
      error({ code }) {
        if (code === 'NOT_FOUND') return { error: 'Post not found' };
        return { error: 'Issue getting post by ID' };
      },
      response: 'publicPost',
    }
  )

  /**
   * Delete a post by its ID.
   */
  .delete(
    '/:id',
    async ({ params }) => deletePostById(parseInt(params.id)),
    {
      error() {
        return { error: 'Issue deleting post by ID' };
      },
      response: 'publicPost',
    }
  )

  /**
   * Edit a post by its ID.
   */
  .put(
    '/:id',
    async ({ params, body }) => editPost(parseInt(params.id), body),
    {
      error() {
        return { error: 'Issue editing post by ID' };
      },
      body: 'publicPost',
      response: 'publicPost',
    }
  )

  /**
   * Search for posts based on a search query.
   */
  .get(
    '/search',
    async ({ query }) => {
      const search = typeof query.search === 'string' ? query.search : '';
      const posts = await searchPosts(search);
      return posts;
    },
    {
      error() {
        return { error: 'Issue searching posts' };
      },
      response: 'publicPosts',
    }
  )
