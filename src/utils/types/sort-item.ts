export type SortItem<T = string> = {
  propertyName: T extends string ? T : keyof T,
  directionAsc: boolean,
}