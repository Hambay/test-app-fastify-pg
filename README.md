Start docker-compose, and go to http://localhost:3300

# Models:

## Category
```
{
  id: string;
  slug: string; // Уникальное название на англ. в системе
  name: string; // Название категории. Англ., кириллица
  description?: string; // Описание категории. Англ., кириллица
  createdDate: Date; // Не управляется клиентом. Создается автом.
  active: boolean; // Вкл, выкл
}
```

# End points:

## GET /categories
returnable format: 
```
{
  result: {
    items: Category[],
    totalCount: number,
  }
}
```
accepted parameters: 
```
{
  // Поиск категорий по полю name
  // По вхождение переданного текста без учета регистра
  // Умеет искать названия с ё через переданное е
  name?: string,
  // Все условия от поля name, но поиск идет по полю description
  description?: string,
  // Поиск по полю active
  // Поддерживаемые значения в параметрах: 0, false, 1, true.
  active?: string,
  // Все условия от поля name и description
  // Поиск осуществляется по полю name и description через “или”
  // При таком запросе фильтры name и description игнорируются
  search?:string,
  // Кол-во записей на страницу. Допустимы только цифры от 1-9
  // По умолчанию 2
  pageSize?: number,
  // Номер страницы. Допустимы только цифры
  // 0 и 1 являются первой страницей.
  page?: number,
  // Сортировка категорий
  // Принимает любое значение в виде названия поля модели категории
  // и необязательного символа направления сортировки
  // в виде - (дефис, тире).
  // Символ означает направление сортировки как DESC
  // Если переданного значения без учета “-” нет в модели категории,
  // то работает сортировка по умолчанию.
  // По умолчанию sort=-createdDate
  sort?: string,
}
```
sort param can handle multiple properties such as: `sort=-createdDate,name,-active`

## GET /categories/:idOrSlug
returnable format: 
```
{
  result: Category
}
```
## POST /categories
returnable format:
```
{
  result: Category
}
```
## DELETE /categories/:id
returnable format:
```
{
  result: boolean
}
```
## PATCH /categories/:id
returnable format:
```
{
  result: Category
}
```