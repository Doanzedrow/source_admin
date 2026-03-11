import React from 'react';
import { Breadcrumb, Button, Flex, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './AppBreadcrumb.less';

const { Title, Text } = Typography;

export interface BreadcrumbItem {
  title: string | React.ReactNode;
  link?: string;
  onClick?: () => void;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  title?: string;
  onBack?: () => void;
  extra?: React.ReactNode;
  id?: string;
}

export const AppBreadcrumb: React.FC<AppBreadcrumbProps> = ({
  items,
  title,
  onBack,
  extra,
  id,
}) => {
  const navigate = useNavigate();

  const breadcrumbItems = items.map((item) => ({
    title: item.link ? (
      <span className="cursor-pointer" onClick={() => navigate(item.link || '#')}>
        {item.title}
      </span>
    ) : (
      item.title
    ),
    onClick: item.onClick,
  }));

  return (
    <div className="app-breadcrumb-container">
      <Breadcrumb items={breadcrumbItems} />
      
      <Flex align="center" justify="space-between" className="breadcrumb-title-row">
        <Flex align="center" gap={12}>
          {onBack && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
              className="back-button"
            />
          )}
          <Flex vertical>
            <Title level={4} style={{ margin: 0 }} className="main-title">
              {title}
            </Title>
            {id && (
              <Text type="secondary" className="id-text">
                ID: {id}
              </Text>
            )}
          </Flex>
        </Flex>
        {extra && <div className="breadcrumb-extra">{extra}</div>}
      </Flex>
    </div>
  );
};

export default AppBreadcrumb;
