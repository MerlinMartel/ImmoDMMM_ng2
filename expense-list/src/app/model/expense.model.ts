export class Expense {
  id: number;
  title: string;
  filename?: string;
  price: number;
  validated: boolean;
  manager: string; // TODO trouver un meilleur nom
  date: string; // TODO pas un string...
  year: number;
  authorId: number;
  created: string;
  modified: string;
  providerId: number;
  provider: string;
  flatId: string;
  flat: string;
  taxCategoryId: string;
  taxCategory: string;
  relativeEditLink: string;
  type: string;
}
