import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { userRoutes } from './routes/user';
import { postRoutes } from './routes/post';

const name = 'Bun Elysia';

const app = new Elysia({
  name,
});

app

  .use(swagger({
    documentation: {
      info: {
        title: `${name} - Documentation`,
        version: '1.0.0'
      },
    },
    path: '/api/v1/docs',
  }))

  .get('/', () => name, {
    response: t.String(),
  })

  app.group('/api/v1', app => app
    .get('/', () => 'API v1')
    .use(userRoutes)
    .use(postRoutes)
  )

  .get('/*', ({ set }) => {
    set.status = 404;
    return 'Not Found';
  }, {
    response: t.String(),
  })

app.listen(process.env.PORT || 3000, ({ hostname, port }) => {
  console.log(`Running at http://${hostname}:${port}`)
});
