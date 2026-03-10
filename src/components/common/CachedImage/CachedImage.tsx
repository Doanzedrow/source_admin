import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import axiosInstance from '@/utils/axiosInstance';
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


const memoryImageCache = new Map<string, string>();

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
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {

      if (!isApiImage) {
        setImageSrc(src);
        setIsLoading(false);
        return;
      }



      if (memoryImageCache.has(src)) {
        setImageSrc(memoryImageCache.get(src) as string);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await axiosInstance.get(src, {
          responseType: 'blob',
        });


        const objectUrl = URL.createObjectURL(response.data);


        memoryImageCache.set(src, objectUrl);

        if (isMounted) {
          setImageSrc(objectUrl);
          setIsError(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsError(true);
          console.error(`Failed to load image from API: ${src}`, error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [src, isApiImage]);


  const finalSrc = isError ? fallbackSrc : imageSrc;

  return (
    <div
      className={`cached-image-wrapper ${className}`}
      style={{ width, height }}
    >

      {isLoading && (
        <div className="cached-image-skeleton">
          <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
        </div>
      )}


      {!isLoading && (
        <img
          src={finalSrc}
          alt={alt}
          className="cached-image-element"
          loading="lazy" /* ĐÂY LÀ CHÌA KHÓA: Giúp không rớt hàng loạt ảnh 1 lúc làm đơ máy */
          onError={() => setIsError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          {...props}
        />
      )}
    </div>
  );
};

export default CachedImage;
