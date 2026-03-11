import React from 'react';
import { Skeleton } from 'antd';
import { useCachedImage } from './useCachedImage';
import './CachedImage.less';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  isApiImage?: boolean;
  fallbackSrc?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  isApiImage = false,
  fallbackSrc = '/favicon.ico',
  className = '',
  width = '100%',
  height = '100%',
  ...props
}) => {
  const { isLoading, finalSrc, setIsError } = useCachedImage(src, isApiImage, fallbackSrc);

  return (
    <div
      className={`cached-image-wrapper ${className}`}
      style={{ width, height }}
    >
      {isLoading && (
        <div className="cached-image-skeleton">
          <Skeleton.Image active className="skeleton-image-active" />
        </div>
      )}

      {!isLoading && (
        <img
          src={finalSrc}
          alt={alt}
          className="cached-image-element"
          loading="lazy" 
          onError={() => setIsError(true)}
          {...props}
        />
      )}
    </div>
  );
};

export default CachedImage;
