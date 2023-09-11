# Bun + Elysia - API Server

### Development
To start the development server run:
```bash
bun run dev
```

### Prisma - Postgres

Set up a database using docker 

```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
```

Update `.env` 
```bash
DATABASE_URL='postgresql://postgres:12345678@localhost:5432/db?schema=public'
```

Sync database with Prisma schema 

```bash
bunx prisma migrate dev --name init
```

### Swagger Plugin

Endpoints generated from Elysia server: `/api/v1/docs`.
