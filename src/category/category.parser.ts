import { BaseError } from '../utils/api.error';
import { prepareForSearch } from '../utils/replacers';
import { isSlug } from '../utils/validators';
import { Category } from './models/category';
import { CreateCategory } from './types/create-category';
import { GetCategoriesDto } from './types/get-categories.dto';
import { GetCategoriesOptions } from './types/get-categories.options';
import { UpdateCategory } from './types/update-category';
import { SortItem } from '../utils/types/sort-item';


export class CategoryParser {
  parseForGet(
    dto: GetCategoriesDto,
    defaultOptions?: GetCategoriesOptions
  ): GetCategoriesOptions {
    const options: GetCategoriesOptions = defaultOptions ?? {};

    const name = dto.name?.trim();
    const description = dto.description?.trim();
    const search = dto.search?.trim();
    const sort = dto.sort?.trim();

    if (name && !search) {
      options.name = prepareForSearch(name);
    }

    if (description && !search) {
      options.description = prepareForSearch(description);
    }
    
    if ('active' in dto) {
      if (dto.active == '1' || dto.active == 'true') {
        options.active = true;
      } else if (dto.active == '0' || dto.active == 'false') {
        options.active = false;
      } else {
        throw new BaseError(400, 'not supported active value, use: 0, false, 1, true');
      };
    }

    if (search) {
      options.search = prepareForSearch(search);
    }

    if ('pageSize' in dto) {
      if (Number.isNaN(Number(dto.pageSize))) {
        throw new BaseError(400, 'pageSize supports only numbers');
      };
      options.pageSize = dto.pageSize;
    }

    if ('page' in dto) {
      if (Number.isNaN(Number(dto.page))) {
        throw new BaseError(400, 'page supports only numbers');
      };
      options.page = (dto.page !== 0) ? dto.page : 1;
    }
    
    if (sort) {
      const sorts: SortItem<Category>[] = [];

      sort.split(',').forEach((sortStr) => {
        const sortName = sortStr.replace(/^-/, '') ;
        const directionAsc = sortStr.charAt(0) !== '-';

        if (!this.isCategoryProperty(sortName)) {
          // throw new BaseError(400, `property '${sortName}' does not exist in category`);
          return;
        }
        const propertyName = sortName as keyof Category;

        sorts.push({ propertyName, directionAsc });
      });

      if (sorts.length) options.sorts = sorts;
    }

    // console.log('options', options);

    return options;
  }

  parseForCreate(dto: CreateCategory): CreateCategory {
    const slug = String(dto.slug).trim();
    const name = String(dto.name).trim();
    const description = String(dto.description).trim();
    const active = !!dto.active;

    if (!isSlug(slug)) {
      throw new BaseError(400, 'invalid slug');
    }
    
    if (!name) {
      throw new BaseError(400, 'invalid name');
    }

    return { slug, name, description, active };
  }

  parseForUpdate(dto: UpdateCategory): UpdateCategory {
    const updatingProps: UpdateCategory = {};

    const slug = dto.slug?.trim();
    const name = dto.name?.trim();

    if ('slug' in dto) {
      if (!slug || !isSlug(slug)) {
        throw new BaseError(400, 'invalid slug');
      }
      updatingProps.slug = slug;
    }

    if (name) {
      updatingProps.name = name;
    }

    if ('description' in dto) {
      updatingProps.description = String(dto.description).trim();
    }
    
    if ('active' in dto) {
      updatingProps.active = !!dto.active;
    }

    // console.log('updatingProps', updatingProps)

    return updatingProps;
  }

  private isCategoryProperty(prop: string): boolean {
    const obj = new Category({
      id: '',
      name: '',
      slug: '',
      createdDate: new Date(),
      active: false,
    });

    return Object.keys(obj).includes(prop);
  }
}
