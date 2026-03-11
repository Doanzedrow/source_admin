import React from 'react';
import { Skeleton } from 'antd';

export const HorizontalBarChartSkeleton: React.FC = () => {
  const barWidths = [85, 65, 45, 30, 15];

  return (
    <>
      <div className="grid-lines-vertical">
        {[...Array(5)].map((_, i) => <div key={i} />)}
      </div>
      <div className="bar-list">
        {barWidths.map((width, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Skeleton.Input active size="small" style={{ width: '80%', height: 16, minWidth: 60 }} />
            </div>
            <div className="bar-container" style={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton.Button active size="small" style={{ width: `${width}%`, height: 24, borderRadius: '0 4px 4px 0', minWidth: 20 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="x-axis-labels-horizontal" style={{ paddingTop: 8 }}>
        <Skeleton.Input active size="small" style={{ width: 30, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 40, height: 14 }} />
        <Skeleton.Input active size="small" style={{ width: 40, height: 14 }} />
      </div>
    </>
  );
};
