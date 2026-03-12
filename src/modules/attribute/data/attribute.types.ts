export interface AttributeVariant {
  _id: string;
  name: string;
  code: string;
  status: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attribute {
  _id: string;
  code: string;
  name: string;
  isMultiple: boolean;
  maxSelect: number;
  overridePrice: boolean;
  status: number;
  variants: AttributeVariant[];
  createdAt?: string;
  updatedAt?: string;
}
