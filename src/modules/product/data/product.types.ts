export interface Product {
  _id: string;
  code: string;
  name: string;
  priceSale: number;
  taxAmount: number;
  priceSaleWithTax: number;
  taxPercentage: number;
  description: string;
  barcode: {
    codes: string[];
    barcode: string;
    barcodeImage: string;
  };
  barcodes: {
    codes: string[];
    barcodeImage: string;
    barcode: string;
  }[];
  ordinal: number;
  stockCount: number;
  isVariant: boolean;
  status: number;
  publish: number;
  type: number;
  category: {
    _id: string;
    name: string;
    code: string;
  };
  categoryCode: string;
  branch: {
    _id: string;
    code: string;
    name: string;
  };
  thumbnail?: {
    _id: string;
    title: string;
    caption: string;
    thumbnail: {
      sizes: {
        avatar: { width: number; height: number; path: string };
        news_thumbnail: { width: number; height: number; path: string };
        news_medium: { width: number; height: number; path: string };
        news_large: { width: number; height: number; path: string };
        product_square: { width: number; height: number; path: string };
        product_review_square: { width: number; height: number; path: string };
      };
      path: string;
    };
    type: number;
  };
  isGift: boolean;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
  deletedBy: string | null;
  refProductId: string;
  createdAt: string;
  updatedAt: string;
  extends: any[];
  id: number;
  __v: number;
  variants: any[];
  inventoryDetails: any[];
}

export interface PaginatedResult<T> {
  data: T[];
  total?: number;
}
