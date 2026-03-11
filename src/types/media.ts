export interface MediaSize {
  name: string;
  path: string;
  width: number;
  height: number;
}

export interface MediaThumbnail {
  id: string;
  path: string;
  sizes: {
    news_large: MediaSize;
    product_square: MediaSize;
    [key: string]: MediaSize;
  };
}

export interface ThumbnailResponse {
  thumbnail: MediaThumbnail;
}
