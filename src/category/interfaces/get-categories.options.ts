import { SortItem } from '../../utils/types/sort-item';
import { Category } from '../models/category';

export type GetCategoriesOptions = {

  name?: string,

  description?: string,

  active?: boolean,

  search?:string,

  pageSize?: number,

  page?: number,

  sorts?: SortItem<Category>[],
}
