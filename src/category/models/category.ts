export interface ICategory {
  id: string;
  slug: string; // Уникальное название на англ. в системе
  name: string; // Название категории. Англ., кириллица
  description?: string; // Описание категории. Англ., кириллица
  createdDate: Date; // Не управляется клиентом. Создается автом.
  active: boolean; // Вкл, выкл
}

export class Category implements ICategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdDate: Date;
  active: boolean;

  constructor(dto: ICategory) {
    this.id = dto.id;
    this.slug = dto.slug;
    this.name = dto.name;
    this.description = dto.description;
    this.createdDate = dto.createdDate;
    this.active = dto.active;
  }
}