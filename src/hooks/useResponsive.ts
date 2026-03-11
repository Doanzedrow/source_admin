import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

/**
 * Hook quản lý chế độ Responsive, tuân thủ theo nguyên tắc chia Grid tiêu chuẩn:
 * - Mobile: < 768px
 * - Tablet: 768px -> 991px
 * - Desktop: 992px -> 1199px
 * - Large Desktop: >= 1200px
 * 
 * @returns Object chứa các trạng thái phân giải hiện tại của thiết bị
 */
export const useResponsive = () => {
  const [device, setDevice] = useState<Breakpoint>('desktop');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        setWindowWidth(width);
        
        if (width < 768) {
          setDevice('mobile');
        } else if (width < 992) {
          setDevice('tablet');
        } else if (width < 1200) {
          setDevice('desktop');
        } else {
          setDevice('largeDesktop');
        }
      }, 50);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    device,
    windowWidth,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isLargeDesktop: device === 'largeDesktop',
    isSmallScreen: device === 'mobile' || device === 'tablet', 
  };
};
