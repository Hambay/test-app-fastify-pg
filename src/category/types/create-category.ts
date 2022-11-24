import { Category } from '../models/category';

export type CreateCategory =
  Pick<Category, 'slug' | 'name' | 'description' | 'active'>