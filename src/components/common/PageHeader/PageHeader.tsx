import React from 'react';
import { Space } from 'antd';
import './PageHeader.less';

interface PageHeaderProps {
  title: string | React.ReactNode;
  actions?: React.ReactNode[];
  subTitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions, subTitle }) => {
  return (
    <div className="page-header flex-between" style={{ marginBottom: 24 }}>
      <div className="page-header-title">
        <h2 style={{ margin: 0 }}>{title}</h2>
        {subTitle && <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--h5-size)' }}>{subTitle}</span>}
      </div>
      {actions && (
        <Space size="middle" className="page-header-actions">
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </Space>
      )}
    </div>
  );
};

export default PageHeader;
