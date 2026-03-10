import React from 'react';
import { List, Skeleton } from 'antd';

export const RecentActivitiesSkeleton: React.FC = () => {
  return (
    <List
      className="activity-list"
      dataSource={[1, 2, 3, 4, 5, 6]}
      renderItem={(key) => (
        <List.Item className="activity-item" key={key}>
          <List.Item.Meta
            avatar={
              <div className="activity-icon-wrapper" style={{ border: 'none', background: 'var(--border-color)' }}>
                <Skeleton.Avatar active size={16} shape="circle" />
              </div>
            }
            title={
              <div className="activity-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton.Input active size="small" style={{ width: '90%', height: 20, display: 'block' }} />
                <Skeleton.Input active size="small" style={{ width: '40%', height: 16, display: 'block' }} />
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
};
