import React from 'react';
import { Card, Typography, List } from 'antd';
import { HistoryOutlined, NotificationOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface RecentActivitiesProps {
  activities: any[];
  t: any;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, t }) => {
  return (
    <Card 
      title={
        <div className="activity-header">
          <HistoryOutlined style={{ marginRight: 8 }} />
          {t('recentActivities')}
        </div>
      } 
      className="activity-sidebar"
      bordered={false}
    >
      <List
        className="activity-list"
        dataSource={activities}
        renderItem={(item: any) => (
          <List.Item className="activity-item">
            <List.Item.Meta
              avatar={
                <div className="activity-icon-wrapper">
                  <NotificationOutlined style={{ fontSize: 13 }} />
                </div>
              }
              title={
                <div className="activity-content">
                  <span 
                    className="description"
                    dangerouslySetInnerHTML={{ __html: item.description || '' }}
                  />
                  <Text type="secondary" className="time">
                    {item.createdAt}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
