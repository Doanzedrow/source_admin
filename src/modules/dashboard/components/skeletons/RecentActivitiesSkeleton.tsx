import { Flex, Skeleton } from 'antd';

export const RecentActivitiesSkeleton: React.FC = () => {
  return (
    <Flex vertical gap={16} className="activity-list">
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Flex key={key} gap={12} align="flex-start" className="activity-item">
          <div className="activity-icon-wrapper" style={{ border: 'none', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skeleton.Avatar active size={16} shape="circle" />
          </div>
          <Flex vertical className="activity-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            <Skeleton.Input active size="small" style={{ width: '90%', height: 20, display: 'block' }} />
            <Skeleton.Input active size="small" style={{ width: '40%', height: 16, display: 'block' }} />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
