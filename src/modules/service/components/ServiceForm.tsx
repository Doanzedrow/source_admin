import React from 'react';
import { Form, Row, Col } from 'antd';
import { AppInput } from '@/components/common/AppInput';
import { AppInputPrice } from '@/components/common/AppInputPrice';
import { AppMediaUpload } from '@/components/common/AppMediaUpload';
import { REGEX } from '@/utils/regex';
import { Select } from 'antd';

const VAT_OPTIONS = [0, 5, 8, 10];

interface ServiceFormProps {
  categories: any[];
  isCategoriesLoading: boolean;
  initialMediaPaths: { thumb: string; origin: string };
  t: any;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  categories,
  isCategoriesLoading,
  initialMediaPaths,
  t,
}) => {
  return (
    <div className="service-form-container">
      <Row gutter={[24, 0]}>
        <Col xs={24} lg={16}>
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <AppInput
                name="code"
                label={t('form.code')}
                placeholder={t('placeholder.code')}
                rules={[
                  {
                    required: true,
                    message: t('validation.required', { field: t('form.code') }),
                  },
                ]}
                regex={REGEX.PRODUCT_CODE}
                regexMessage={t('validation.invalidCode')}
              />
            </Col>
            <Col xs={24} sm={16}>
              <AppInput
                name="name"
                label={t('form.name')}
                placeholder={t('placeholder.name')}
                rules={[
                  {
                    required: true,
                    message: t('validation.required', { field: t('form.name') }),
                  },
                ]}
                regex={REGEX.PRODUCT_NAME}
                regexMessage={t('validation.invalidName')}
              />
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="category"
                label={t('form.category')}
                rules={[
                  {
                    required: true,
                    message: t('validation.required', { field: t('form.category') }),
                  },
                ]}
              >
                <Select
                  placeholder={t('placeholder.category')}
                  size="large"
                  showSearch
                  optionFilterProp="children"
                  loading={isCategoriesLoading}
                >
                  {categories.map((cat) => (
                    <Select.Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item name="status" label={t('form.status')}>
                <Select size="large">
                  <Select.Option value={true}>{t('status.active')}</Select.Option>
                  <Select.Option value={false}>{t('status.inactive')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <AppInputPrice
                name="priceSale"
                style={{ width: '100%' }}
                label={t('form.priceSale')}
                placeholder={t('placeholder.price')}
                rules={[
                  {
                    required: true,
                    message: t('validation.required', { field: t('form.priceSale') }),
                  },
                ]}
              />
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="taxPercentage" label={t('form.taxPercentage')}>
                <Select size="large">
                  {VAT_OPTIONS.map((v) => (
                    <Select.Option key={v} value={v}>
                      {v}%
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <AppInputPrice
                name="priceSaleWithTax"
                label={t('form.priceAfterTax')}
                placeholder={t('placeholder.price')}
                rules={[
                  {
                    required: true,
                    message: t('validation.required', { field: t('form.priceAfterTax') }),
                  },
                ]}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <AppInput
                name="description"
                label={t('form.description')}
                placeholder={t('placeholder.description')}
                isTextArea
                rows={4}
              />
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8}>
          <div className="media-panel">
            <Form.Item name="thumbnail" label={t('form.image')} style={{ marginBottom: 12 }}>
              <AppMediaUpload 
                type="product" 
                maxCount={1} 
                initialValuePath={initialMediaPaths.thumb}
                initialOriginalPath={initialMediaPaths.origin}
              />
            </Form.Item>
          </div>
        </Col>
      </Row>
    </div>
  );
};
