import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Space, Checkbox, Switch, Row, Col, Typography, Divider } from 'antd';
import { SafetyCertificateOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useAppNotify } from '@/hooks/useAppNotify';
import {
  useGetPermissionByIdQuery,
  useAddPermissionMutation,
  useEditPermissionMutation,
} from '../api/permissionApi';

const { Title } = Typography;

const PermissionUpsert: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { t } = useTranslation(['permission', 'translation']);
  const { goToPermissionList } = useAppNavigate();
  const { message } = useAppNotify();
  const [form] = Form.useForm();

  const { data: permissionData, isLoading: isFetching } = useGetPermissionByIdQuery(id as string, {
    skip: !isEdit,
  });

  const [addPermission, { isLoading: isAdding }] = useAddPermissionMutation();
  const [editPermission, { isLoading: isEditing }] = useEditPermissionMutation();

  useEffect(() => {
    if (permissionData?.result) {
      form.setFieldsValue(permissionData.result);
    }
  }, [permissionData, form]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await editPermission({ id: id as string, body: values }).unwrap();
        message.success(t('common.updateSuccess', { ns: 'translation' }));
      } else {
        await addPermission(values).unwrap();
        message.success(t('common.addSuccess', { ns: 'translation' }));
      }
      goToPermissionList();
    } catch (error: any) {
      message.error(error?.data?.message || t('common.error', { ns: 'translation' }));
    }
  };

  return (
    <div className="page-content">
      <Card
        loading={isFetching}
        title={
          <Space>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={goToPermissionList}
            />
            <Divider type="vertical" />
            <Space>
              <SafetyCertificateOutlined style={{ color: 'var(--primary-color)' }} />
              <Title level={5} style={{ margin: 0 }}>
                {isEdit 
                  ? t('editPermission', { ns: 'permission', defaultValue: 'Chỉnh sửa phân quyền' }) 
                  : t('addPermission', { ns: 'permission', defaultValue: 'Thêm mới phân quyền' })
                }
              </Title>
            </Space>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isAdding || isEditing}
            onClick={() => form.submit()}
          >
            {t('common.save', { ns: 'translation' })}
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 1,
            actions: {
              view: false,
              create: false,
              update: false,
              delete: false,
            },
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label={t('fields.name', { ns: 'permission', defaultValue: 'Tên phân quyền' })}
                name="name"
                rules={[{ required: true, message: t('common.required', { ns: 'translation' }) }]}
              >
                <Input placeholder={t('placeholders.name', { ns: 'permission' })} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={t('fields.module', { ns: 'permission', defaultValue: 'Module' })}
                name="module"
                rules={[{ required: true, message: t('common.required', { ns: 'translation' }) }]}
              >
                <Input placeholder={t('placeholders.module', { ns: 'permission' })} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{t('sections.actions', { ns: 'permission', defaultValue: 'Hành động được phép' })}</Divider>
          
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name={['actions', 'view']} valuePropName="checked">
                <Checkbox>VIEW</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['actions', 'create']} valuePropName="checked">
                <Checkbox>CREATE</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['actions', 'update']} valuePropName="checked">
                <Checkbox>UPDATE</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['actions', 'delete']} valuePropName="checked">
                <Checkbox>DELETE</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item
            label={t('fields.status', { ns: 'permission', defaultValue: 'Trạng thái' })}
            name="status"
            valuePropName="checked"
            getValueProps={(value) => ({ checked: value === 1 })}
            getValueFromEvent={(checked) => (checked ? 1 : 0)}
          >
            <Switch checkedChildren={t('common.active', { ns: 'translation' })} unCheckedChildren={t('common.inactive', { ns: 'translation' })} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PermissionUpsert;
