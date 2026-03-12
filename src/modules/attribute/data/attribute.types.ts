export interface Attribute {
  _id: string;
  code: string;
  name: string;
  isMultiple: boolean;
  overridePrice: boolean;
  status: number;
  createdAt?: string;
  updatedAt?: string;
}
