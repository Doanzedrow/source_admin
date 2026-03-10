import React from 'react';
import { Skeleton } from 'antd';

export const DashboardChartSkeleton: React.FC = () => {
  return (
    <>
      <div className="chart-header">
        <div className="title-section" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton.Input active size="small" style={{ width: 120, height: 22 }} />
          <Skeleton.Input active size="small" style={{ width: 90, height: 22 }} />
        </div>
        <Skeleton.Button active size="small" style={{ width: 120, height: 24 }} />
      </div>

      <div className="chart-tabs" style={{ gap: 24 }}>
        <Skeleton.Button active size="small" style={{ width: 60, height: 22 }} />
        <Skeleton.Button active size="small" style={{ width: 60, height: 22 }} />
        <Skeleton.Button active size="small" style={{ width: 80, height: 22 }} />
      </div>

      <div className="chart-placeholder" style={{ display: 'block', paddingBottom: 20 }}>
        <Skeleton.Node active style={{ width: '100%', height: '300px', borderRadius: 0 }}>
          <span />
        </Skeleton.Node>
      </div>
    </>
  );
};
