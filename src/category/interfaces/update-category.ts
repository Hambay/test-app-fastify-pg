import { Category } from '../models/category';

export type UpdateCategory =
  Partial<Pick<Category, 'slug' | 'name' | 'description' | 'active'>>