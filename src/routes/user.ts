import { Elysia, t } from 'elysia';
import { getProfile, getUsers, signUpUser } from '../services/user';

const signUpModel = {
  'post:body.sign-up': t.Object({
    username: t.String(),
    password: t.String({
      minLength: 8
    })
  }),
  'post:response.sign-up': t.Object({
    id: t.Number(),
    username: t.String(),
  }),

  'get:response.profile.username': t.Object({
    id: t.Number(),
    username: t.String(),
  }),

  'get:response.search': t.Array(
    t.Object({
      id: t.Number(),
      username: t.String(),
    })
  ),
};

export const userRoutes = new Elysia({ prefix: '/user' })

  .model(signUpModel)
  .post(
    '/sign-up',
    async ({ body }) => signUpUser(body),
    {
      error({ code }) {
        switch (code as string) {
          case 'P2002': // Prisma P2002: "Unique constraint failed on the {constraint}"
            return {
              error: 'Username must be unique'
            }
          default:
            return {
              error: 'Issue creating user'
            }
        }
      },
      body: 'post:body.sign-up',
      response: 'post:response.sign-up',
    }
  )

  .get(
    '/profile/:username',
    async (context) => {
      const profile = await getProfile(context.params.username);
      if (!profile) throw { code: 'NOT_FOUND' };
      return profile;
    },
    {
      error({ code }) {
        return {
          error: code === 'NOT_FOUND' ? 'Profile not found' : 'Issue getting profile',
        }
      },
      response: 'get:response.profile.username',
    }
  )

  .get(
    '/search',
    async ({ query }) => {
      const search = typeof query.search === 'string' ? query.search : '';
      const users = await getUsers(search);
      return users;
    },
    {
      error() {
        return {
          error: 'Issue searching users'
        }
      },
      response: 'get:response.search',
    }
  )
