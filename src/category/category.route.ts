import { FastifyInstance } from 'fastify';
import { CreateCategory } from './types/create-category';
import { isUUID } from '../utils/validators';
import { CategoryController } from './category.controller';
import { GetOneCategoryOptions } from './types/get-one-category.options';
import { UpdateCategory } from './types/update-category';
import { CategoryParser } from './category.parser';
import { GetCategoriesDto } from './types/get-categories.dto';
import { BaseError } from '../utils/api.error';


export async function categoryRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateCategory }>('/categories', async (request) => {
    const parser = new CategoryParser();
    const controller = new CategoryController(app.pg);

    const dto = parser.parseForCreate(request.body);
    
    const result = await controller.create(dto);
    
    return { result };
  })

  app.get<{ Querystring: GetCategoriesDto }>('/categories', async (request) => {
    const parser = new CategoryParser();
    const controller = new CategoryController(app.pg);

    const options = parser.parseForGet(request.query, {
      sorts: [
        { propertyName: 'createdDate', directionAsc: false },
      ],
      pageSize: controller.defaultPageSize,
    });

    const result = await controller.get(options);
    
    return { result };

  })

  app.get<{ Params: { idOrSlug: string }}>('/categories/:idOrSlug', async (request) => {
    const { idOrSlug } = request.params;

    const options: GetOneCategoryOptions =
      isUUID(idOrSlug) ?
      { id: idOrSlug } :
      { slug: idOrSlug };

    const controller = new CategoryController(app.pg);
    
    const result = await controller.getOne(options);
    
    if (!result) throw new BaseError(404, 'not found');
    
    return { result };
  })

  app.patch<{ Params: { id: string }, Body: UpdateCategory }>('/categories/:id', async (request) => {
    const { id } = request.params;

    const parser = new CategoryParser();
    const controller = new CategoryController(app.pg);

    const dto = parser.parseForUpdate(request.body);

    const result = await controller.update(id, dto);
      
    return { result };
  })

  app.delete<{ Params: { id: string }}>('/categories/:id', async (request) => {
    const { id } = request.params;

    const controller = new CategoryController(app.pg);
    
    const result = await controller.remove(id);
    
    return { result };
  })
}
