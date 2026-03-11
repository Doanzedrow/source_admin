import React, { useState } from 'react';
import { Space, Row, Col } from 'antd';
import { FilterOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';

interface AppFilterProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
  onReset?: () => void;
  isLoading?: boolean;
}

export const AppFilter: React.FC<AppFilterProps> = ({ children, extra, onReset, isLoading }) => {
  const { t } = useTranslation('translation');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="app-filter-sticky-wrapper"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        paddingBottom: 16,
        marginTop: -8,
        backgroundColor: 'var(--body-background)',
      }}
    >
      <AppCard className="filter-card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col flex="1">
            <Row gutter={[16, 16]} align="middle">
              {children}
            </Row>
          </Col>

          <Col>
            <Space>
              {extra && (
                <AppButton
                  type="text"
                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setIsExpanded(!isExpanded)}
                  style={{ color: 'var(--primary-color)' }}
                >
                  <FilterOutlined /> {t('common.actions.filter')}
                </AppButton>
              )}

              <AppButton icon={<ReloadOutlined />} onClick={onReset} loading={isLoading}>
                {t('common.actions.reset')}
              </AppButton>
            </Space>
          </Col>
        </Row>

        {extra && (
          <div
            style={{
              maxHeight: isExpanded ? '500px' : '0',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              marginTop: isExpanded ? 16 : 0,
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div style={{ borderTop: '1px solid var(--border-color-split)', paddingTop: 16 }}>
              <Row gutter={[16, 16]}>{extra}</Row>
            </div>
          </div>
        )}
      </AppCard>
    </div>
  );
};
