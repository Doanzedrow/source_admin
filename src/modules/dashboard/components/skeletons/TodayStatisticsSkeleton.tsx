import React from 'react';
import { Skeleton } from 'antd';

export const TodayStatisticsSkeleton: React.FC = () => {
  return (
    <div className="today-stats-grid">
      {[1, 2, 3, 4].map((key) => (
        <div className="stat-item" key={key}>
          <div className="item-icon" style={{ background: 'var(--border-color)', width: 40, height: 40, marginRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton.Avatar active size={32} shape="circle" />
          </div>
          <div className="item-info" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Skeleton.Input active size="small" style={{ width: '40%', minWidth: 60, height: 18, display: 'block' }} />
            <Skeleton.Input active size="small" style={{ width: '70%', minWidth: 100, height: 24, display: 'block' }} />
            <Skeleton.Input active size="small" style={{ width: '50%', minWidth: 80, height: 16, display: 'block' }} />
          </div>
        </div>
      ))}
    </div>
  );
};
