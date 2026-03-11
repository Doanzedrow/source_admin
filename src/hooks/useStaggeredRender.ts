import { useState, useEffect } from 'react';

/**
 * Hook phân tầng (Cascading/Staggered) render UI components nặng
 * Giúp tránh trình duyệt bị treo khi load đồng loạt component và gọi chung nhiều API.
 * 
 * @param delays Mảng số nguyên quy định số mili-giây (thời điểm mở khoá từng phần). 
 * Ví dụ: [150, 550] (Step 2 bật sau 150ms, Step 3 bật sau 550ms)
 * @returns loadStep - Trạng thái render hiện tại (bắt đầu từ 1, tăng dần)
 */
export const useStaggeredRender = (delays: number[] = [150, 500]) => {
  const [loadStep, setLoadStep] = useState<number>(1);

  useEffect(() => {
    // Nếu mảng trễ rỗng, khóa luôn cấp độ cao nhất
    if (!delays || delays.length === 0) {
      setLoadStep(999);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    delays.forEach((delay, index) => {
      const timer = setTimeout(() => {
        setLoadStep((prev) => Math.max(prev, index + 2));
      }, delay);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [JSON.stringify(delays)]);

  return loadStep;
};
