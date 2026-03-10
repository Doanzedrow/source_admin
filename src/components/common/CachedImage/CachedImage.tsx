import React, { useState, useEffect } from 'react';
import { Skeleton } from 'antd';
import axiosInstance from '../../../utils/axiosInstance';
import './CachedImage.less';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  isApiImage?: boolean; // Bật lên nếu ảnh cần fetch qua API (có gắn Token)
  fallbackSrc?: string; // Ảnh mặc định khi bị lỗi 404 hoặc mất mạng
  className?: string;
  width?: string | number;
  height?: string | number;
}

// In-memory Cache siêu tốc để không tải lại cùng 1 link ảnh API trong suốt phiên làm việc
const memoryImageCache = new Map<string, string>();

export const CachedImage: React.FC<CachedImageProps> = ({
  src,
  alt,
  isApiImage = false,
  fallbackSrc = '/favicon.ico', // Đặt ảnh logo mặc định của SPA Thanh Xuân
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
      // 1. Nếu là ảnh Public cục bộ hoặc link web thường (Không cần Token) -> Cứ để trình duyệt tự do Cache + Lazy Load native
      if (!isApiImage) {
        setImageSrc(src);
        setIsLoading(false);
        return;
      }

      // 2. Nếu là ảnh API CẦN BẢO MẬT (Có truyền Token)
      // Check Cache RAM trước tiên
      if (memoryImageCache.has(src)) {
        setImageSrc(memoryImageCache.get(src) as string);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Bắn Axios để lấy ảnh (Axios instance đã được nhúng sẵn Token tại Header)
        const response = await axiosInstance.get(src, {
          responseType: 'blob', // Phải là blob để convert thành file ảnh
        });

        // Chuyển dữ liệu nhị phân thành đường dẫn ảo (Blob URL)
        const objectUrl = URL.createObjectURL(response.data);
        
        // Lưu vào Cache RAM để các Component khác dùng chung link này thì khỏi cần gọi lại API
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

  // Nếu tải lỗi, gán lại hình ảnh báo lỗi / hình mặc định
  const finalSrc = isError ? fallbackSrc : imageSrc;

  return (
    <div 
      className={`cached-image-wrapper ${className}`} 
      style={{ width, height }}
    >
      {/* Skeleton (Hiệu ứng nhấp nháy Loading) cực kỳ mượt mà khi đang chờ tải */}
      {isLoading && (
        <div className="cached-image-skeleton">
          <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
        </div>
      )}

      {/* Thẻ Img Render - Thêm thuộc tính loading="lazy" vào đây */}
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
