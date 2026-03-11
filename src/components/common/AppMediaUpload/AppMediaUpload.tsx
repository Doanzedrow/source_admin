import React, { useState } from 'react';
import { Upload, Typography, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useUploadMediaMutation, getFullImageUrl } from '@/store/api/uploadApi';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import './AppMediaUpload.less';

const { Text } = Typography;

interface AppMediaUploadProps {
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  maxCount?: number;
  type?: 'product' | 'general';
  uploadAction?: (file: File) => Promise<any>;
  disabled?: boolean;
}

export const AppMediaUpload: React.FC<AppMediaUploadProps> = ({
  value,
  onChange,
  maxCount = 1,
  type = 'product',
  uploadAction,
  disabled = false,
}) => {
  const { t } = useTranslation('translation');
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const getFileList = (): UploadFile[] => {
    if (!value) return [];
    const paths = Array.isArray(value) ? value : [value];
    return paths.map((path, index) => ({
      uid: `-${index}`,
      name: `image-${index}.png`,
      status: 'done',
      url: getFullImageUrl(path),
      response: { path },
    }));
  };

  const [fileList, setFileList] = useState<UploadFile[]>(getFileList());

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('file', file as File);

      let responsePath = '';

      if (uploadAction) {
        const res = await uploadAction(file as File);
        responsePath = res.path || res.url;
      } else {
        const res = await uploadMedia(formData).unwrap();
        if (type === 'product') {
          responsePath = res.result.thumbnail.sizes.product_square?.path || res.result.thumbnail.path;
        } else {
          responsePath = res.result.thumbnail.path;
        }
      }

      message.success(t('common.messages.success'));

      const newFile: UploadFile = {
        uid: (file as any).uid,
        name: (file as File).name,
        status: 'done',
        url: getFullImageUrl(responsePath),
        response: { path: responsePath },
      };

      const newFileList = [...fileList, newFile];
      setFileList(newFileList);

      if (maxCount === 1) {
        onChange?.(responsePath);
      } else {
        onChange?.(newFileList.map(f => f.response.path).filter(Boolean));
      }

      onSuccess?.(newFile);
    } catch (err: any) {
      message.error(t('common.messages.error'));
      onError?.(err);
    }
  };

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    if (maxCount === 1) {
      onChange?.('');
    } else {
      onChange?.(newFileList.map(f => f.response?.path).filter(Boolean));
    }
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div className="upload-trigger-content">
      <PlusOutlined style={{ fontSize: 24, color: 'var(--text-secondary)' }} />
      <div style={{ marginTop: 8 }}>
        <Text type="secondary">{t('common.actions.upload')}</Text>
      </div>
    </div>
  );

  return (
    <>
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onRemove={onRemove}
        disabled={disabled || isLoading}
        maxCount={maxCount}
        className="app-media-upload"
        accept="image/*"
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          previewIcon: <EyeOutlined />,
          removeIcon: <DeleteOutlined />,
        }}
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width={600}
        wrapClassName="media-preview-modal"
      >
        <img alt="preview" style={{ width: '100%', borderRadius: 8 }} src={previewImage} />
      </Modal>
    </>
  );
};

export default AppMediaUpload;
