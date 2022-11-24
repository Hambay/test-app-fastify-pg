import { PostgresDb } from '@fastify/postgres';
import { prepareOrderStatement } from '../utils/prepare-order-statement';
import { ItemsWithCount } from '../utils/types/items-with-count';
import { TotalCount } from '../utils/types/total-count';
import { Category } from './models/category';
import { CreateCategory } from './types/create-category';
import { GetCategoriesOptions } from './types/get-categories.options';
import { GetOneCategoryOptions } from './types/get-one-category.options';
import { UpdateCategory } from './types/update-category';


export class CategoryController {
  private readonly tableName = 'categories';
  readonly defaultPageSize = 2;

  constructor(private readonly pg: PostgresDb) {}

  async create(dto: CreateCategory): Promise<Category> {
    console.log('create', dto);
    
    const query =
      `INSERT into ${this.tableName}
      (slug, name, description, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const args = [
      dto.slug,
      dto.name,
      dto.description ?? 'NULL',
      dto.active
    ];

    console.log(query, args);

    const result = await this.pg.query<Category>(query, args);
    
    return result.rows[0];
  }

  async update(id: string, dto: UpdateCategory) {
    const fields = Object.entries(dto).map(
      ([key], index) => {
        return `${key} = $${index + 2}`
      }
    );
    const fieldsStr = fields.join(',');
    const query =
      `UPDATE ${this.tableName}
      SET ${fieldsStr}
      WHERE id = $1
      RETURNING *`;
    const args = [id, ...Object.values(dto)];

    // console.log(query, args);

    const result = await this.pg.query<Category>(query, args);

    return result.rows.shift();
  }

  async get(options: GetCategoriesOptions): Promise<ItemsWithCount<Category>> {
    const conditions: string[] = [];
    const args: string[] = [];

    if ('search' in options) {
      args.push(String(options.search));
      conditions.push(
        `(lower(description) SIMILAR TO $${args.length}
        OR lower(name) SIMILAR TO $${args.length})`
      );
    } else {
      if ('name' in options) {
        args.push(String(options.name));
        conditions.push(`lower(name) SIMILAR TO $${args.length}`);
      }
  
      if ('description' in options) {
        args.push(String(options.description));
        conditions.push(`lower(description) SIMILAR TO $${args.length}`);
      }
    }

    if ('active' in options) {
      args.push(String(options.active));
      conditions.push('active = $' + args.length);
    }

    let offset: number | null = null;
    const pageSize = options?.pageSize ?? this.defaultPageSize;

    if (options?.page && options.page > 1) {
      offset = (options.page - 1) * pageSize;
    }

    const whereStatement = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const limitStatement = pageSize ? `LIMIT ${pageSize}` : '';
    const offsetStatement = offset ? `OFFSET ${offset}` : '';
    const orderStatement = prepareOrderStatement(options?.sorts);

    const query =
      `WITH cte AS (
        SELECT *
        FROM ${this.tableName}
        ${whereStatement}
      ) SELECT *
      FROM  (
        TABLE cte
        ${orderStatement}
        ${limitStatement}
        ${offsetStatement}
        ) sub
      RIGHT JOIN (SELECT count(*) FROM cte) c("totalCount") ON true;`;

    console.log(query, args);

    const result = await this.pg.query<Category & Partial<TotalCount>>(query, args);

    const totalCount = result.rows?.[0].totalCount ?? 0;

    return {
      items: result.rows.filter((i) => i.id).map((item) => {
        delete item.totalCount;
        return item;
      }),
      totalCount,
    };
  }

  async remove(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const args = [id];

    // console.log(query, args);

    const result = await  this.pg.query(query, args);

    return !!result.rowCount;
  }

  async getOne(options: GetOneCategoryOptions): Promise<Category | undefined> {
    const conditionKey = options.slug ? 'slug' : 'id';
    const conditionValue = options.slug ?? options.id;

    const query =
      `SELECT * FROM ${this.tableName}
      WHERE ${conditionKey} = $1`;
    const args = [conditionValue];

    // console.log(query, args);

    const result = await this.pg.query<Category>(query, args);

    return result.rows.shift();
  }
}
