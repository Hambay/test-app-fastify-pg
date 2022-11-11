import fastifyPostgres from '@fastify/postgres'
import fastify from 'fastify'
import { dbInit } from './db.init';
import { categoryRoutes } from './category/category.route';
import { BaseError } from './utils/api.error';

const app = fastify();

app.register(fastifyPostgres, {
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
})

app.register(dbInit);

app.register(categoryRoutes);

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  
  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send({ error: error.message });
  }
  reply.status(500).send({ error: error.message });
})

app.listen({ port: 3300, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
})
