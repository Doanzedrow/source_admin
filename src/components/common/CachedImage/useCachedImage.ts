import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';

const memoryImageCache = new Map<string, string>();

export const useCachedImage = (src: string, isApiImage: boolean, fallbackSrc: string) => {
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

  return { isLoading, finalSrc, setIsError };
};
