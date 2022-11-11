import { FastifyInstance } from 'fastify';
import { INITIAL_DATA } from './constants';
import { Category } from './category/models/category';
import { CategoryParser } from './category/category.parser';
import { CategoryController } from './category/category.controller';

export const dbInit = async (instance: FastifyInstance) => {
  const parser = new CategoryParser();
  const controller = new CategoryController(instance.pg);

  await instance.pg.query(`CREATE TABLE IF NOT EXISTS "categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "slug" text UNIQUE NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "createdDate" timestamp DEFAULT now(),
        "active" boolean NOT NULL
      );`,
  );
  const data = INITIAL_DATA;

  const req = await instance.pg.query<Category>(`SELECT * from categories`);

  if (req.rowCount == 0) {
    for (const item of data) {
      try {
        const dto = parser.parseForCreate(item);
  
        await controller.create(dto);
      } catch(error) {
        console.error('error in initializing data', error);
      }
    }
  }
}
