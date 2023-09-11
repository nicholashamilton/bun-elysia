import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { PrismaClient } from '@prisma/client' 

const name = 'Bun Elysia';

const app = new Elysia({
  name,
});

const db = new PrismaClient();

const users = new Elysia({ prefix: '/user' })
  // .post('/sign-in', signIn)
  // .post('/sign-up', signUp)
  // .post('/profile', getProfile)

  .model({
    'body.sign-up': t.Object({
      username: t.String(),
      password: t.String({
          minLength: 8
      })
    }),
    'response.sign-up': t.Object({
      id: t.Number(),
      username: t.String(),
    })
  })
  .post(
    '/sign-up', 
    async ({ body }) => db.user.create({
      data: body,
      select: { 
        id: true,
        username: true,
      },
    }),
    {
      error({ code }) {
        switch (code as string) {
          // Prisma P2002: "Unique constraint failed on the {constraint}"
          case 'P2002':
            return {
                error: 'Username must be unique'
            }
        }
      },
      body: 'body.sign-up',
      response: 'response.sign-up',
    }
  )

app

  .use(swagger({
    documentation: {
      info: {
        title: `${name} - Documentation`,
        version: '1.0.0'
      },
    },
    path: '/v1/docs'
  }))

  app.group('/api/v1', app => app
    .get('/', () => 'Using v1')
    .use(users)
  )

  .get('/', () => name, {
    response: t.String(),
  })

  // .model({
  //   'user.sign-up-body': t.Object({
  //       username: t.String(),
  //       password: t.String({
  //           minLength: 8
  //       })
  //   }),
  //   'user.sign-up-response': t.Object({
  //     id: t.Number(),
  //     username: t.String(),
  //   })
  // })

  // .post(
  //   '/sign-up', 
  //   async ({ body }) => db.user.create({
  //       data: body,
  //       select: { 
  //           id: true,
  //           username: true,
  //       },
  //   }),
  //   {
  //     error({ code }) {
  //         switch (code as string) {
  //           // Prisma P2002: "Unique constraint failed on the {constraint}"
  //           case 'P2002':
  //             return {
  //                 error: 'Username must be unique'
  //             }
  //         }
  //     },
  //     body: 'user.sign-up-body',
  //     response: 'user.sign-up-response',
  //   }
  // )

  .get('/id', ({ query }) => {
    return typeof query.id === 'string' ? query.id : '';
  }, {
    response: t.String(),
  })

  .get('/id/:id', (context) => context.params.id, {
    response: t.String(),
  })

  .model({
    'order.get-response': t.Object({
      order: t.Object({
        id: t.Number(),
        title: t.String(),
        items: t.Array(t.Object({
          id: t.Number(),
          title: t.String(),
        }))
      }),
    })
  })

  .get('/order', () => ({
    order: {
      id: 43,
      title: 'Order #43',
      items: [],
    },
  }), {
    response: 'order.get-response',
  })

  .get('/*', ({ set }) => {
      set.status = 404;
      return 'Not Found';
  }, {
    response: t.String(),
  })

app.listen(3000, ({ hostname, port }) => {
  console.log(`Running at http://${hostname}:${port}`)
});
