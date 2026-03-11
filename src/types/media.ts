export interface MediaSize {
  name: string;
  path: string;
  width: number;
  height: number;
}

export interface MediaThumbnail {
  id: string;
  _id: string;
  path: string;
  sizes: {
    news_large: MediaSize;
    product_square: MediaSize;
    [key: string]: MediaSize;
  };
}

export interface MediaResult {
  _id: string;
  id: number;
  thumbnail: MediaThumbnail;
  [key: string]: any;
}

export interface ThumbnailResponse extends MediaResult {}
