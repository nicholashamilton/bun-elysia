import { Elysia, t } from 'elysia';
import { getProfile, getUsers, signUpUser } from '../services/user';

const publicUser = t.Object({
  id: t.Number(),
  username: t.String(),
});

const publicUsers = t.Array(publicUser);

const signUpDTO = t.Object({
  username: t.String(),
  password: t.String({
    minLength: 8
  }),
});

const signUpModel = {
  signUpDTO,
  publicUser,
  publicUsers,
};

export const userRoutes = new Elysia({ prefix: '/user' })

  .model(signUpModel)

  /**
  * Get user's profile by username.
  */
  .get(
    '/profile/:username',
    async (context) => {
      const profile = await getProfile(context.params.username);
      if (!profile) throw { code: 'NOT_FOUND' };
      return profile;
    },
    {
      error({ code }) {
        if (code === 'NOT_FOUND') return { error: 'Profile not found' };
        return { error: 'Issue getting profile' };
      },
      response: 'publicUser',
    }
  )

  /**
   * Search for users.
   */
  .get(
    '/search',
    async ({ query }) => {
      const search = typeof query.search === 'string' ? query.search : '';
      const users = await getUsers(search);
      return users;
    },
    {
      error() {
        return { error: 'Issue searching users' };
      },
      response: 'publicUsers',
    }
  )

  /**
   * Create a new user.
   */
  .post(
    '/sign-up',
    async ({ body }) => signUpUser(body),
    {
      error({ code }) {
        switch (code as string) {
          case 'P2002': // Prisma P2002: "Unique constraint failed on the {constraint}"
            return { error: 'Username must be unique' };
          default:
            return { error: 'Issue creating user' };
        }
      },
      body: 'signUpDTO',
      response: 'publicUser',
    }
  )