import { SortItem } from './types/sort-item';

export function prepareOrderStatement(sorts?: SortItem<any>[]): string {
  if (!sorts?.length) return '';

  console.log('prepareOrderStatement');

  const orderStrings = sorts.map(({propertyName, directionAsc}) => {
  console.log('propertyName', propertyName);
  console.log('directionAsc', directionAsc);
  return `"${propertyName}" ${directionAsc ? 'ASC' : 'DESC'}`;
  })

  return `ORDER BY ${orderStrings.join(',')}`;
}