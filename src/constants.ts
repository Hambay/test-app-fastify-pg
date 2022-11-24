import { CreateCategory } from './category/types/create-category';

export const INITIAL_DATA: CreateCategory[] = [
  { slug: 'electronic', name: 'Електроника', description: 'Електро товары', active: true },
  { slug: 'cars', name: 'машины', description: '', active: false },
  { slug: 'phones', name: 'Телефоны', description: 'трубки', active: true },
  { slug: 'med', name: 'Мёд', description: 'Мёд копатыча', active: false },
];
