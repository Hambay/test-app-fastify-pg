import { TotalCount } from './total-count';

export interface ItemsWithCount<T> extends TotalCount {
  items: T[];
};