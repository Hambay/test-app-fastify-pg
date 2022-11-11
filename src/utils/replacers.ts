export function prepareForSearch(str: string): string {
  const newStr = str
    .replace(/[её]/g, '(е|ё)')
    .toLowerCase();
  return `%${newStr}%`;
}