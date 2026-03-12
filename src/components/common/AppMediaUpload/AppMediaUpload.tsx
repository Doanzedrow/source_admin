import React, { useState } from 'react';
import { Upload, Typography, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
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
  initialValuePath?: string | string[];
  initialOriginalPath?: string | string[];
  className?: string;
  style?: React.CSSProperties;
}
export const AppMediaUpload: React.FC<AppMediaUploadProps> = ({
  value,
  onChange,
  maxCount = 1,
  type = 'product',
  uploadAction,
  disabled = false,
  initialValuePath,
  initialOriginalPath,
  className,
  style,
}) => {
  const { t } = useTranslation('translation');
  const { message: msg } = useAppNotify();
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [uploadedMap, setUploadedMap] = useState<Record<string, { thumb: string; origin: string }>>({});

  const getFileList = (): UploadFile[] => {
    const displayValues = (val: string | string[], paths?: string | string[], origins?: string | string[]) => {
      const items = Array.isArray(val) ? val : [val];
      const initialPaths = Array.isArray(paths) ? paths : [paths];
      const initialOrigins = Array.isArray(origins) ? origins : [origins];

      return items
        .map((item, index) => {
          const mapData = uploadedMap[item as string];
          const thumbPath =
            item && (item as string).includes('/') 
              ? (item as string) 
              : (mapData?.thumb || initialPaths[index] || '');
              
          const originPath = mapData?.origin || initialOrigins[index] || thumbPath;

          return {
            uid: (item && !(item as string).includes('/')) ? (item as string) : `-${index}`,
            name: `image-${index}.png`,
            status: 'done' as const,
            url: thumbPath ? getFullImageUrl(thumbPath) : '',
            response: { path: thumbPath, originalPath: originPath, id: item },
          } as UploadFile;
        })
        .filter((f) => f.url);
    };

    if (!value) return [];
    return displayValues(value, initialValuePath, initialOriginalPath);
  };

  const [fileList, setFileList] = useState<UploadFile[]>(getFileList());

  React.useEffect(() => {
    setFileList(getFileList());
  }, [value, initialValuePath, initialOriginalPath]);

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file as File);

      let responsePath = '';
      let originalPath = '';
      let responseId = '';

      if (uploadAction) {
        const res = await uploadAction(file as File);
        responsePath = res.path || res.url;
        originalPath = res.originalPath || responsePath;
        responseId = res.id || responsePath;
      } else {
        const res = await uploadMedia(formData).unwrap();
        responseId = (res.result as any)._id;
        originalPath = res.result.thumbnail.path;
        
        if (type === 'product') {
          responsePath =
            res.result.thumbnail.sizes.product_square?.path || originalPath;
        } else {
          responsePath = originalPath;
        }
      }

      msg.success(t('common.messages.success'));

      const newFile: UploadFile = {
        uid: (file as any).uid,
        name: (file as File).name,
        status: 'done',
        url: getFullImageUrl(responsePath),
        response: { path: responsePath, originalPath: originalPath, id: responseId },
      };

      const newFileList = maxCount === 1 ? [newFile] : [...fileList, newFile];
      setFileList(newFileList);

      // Lưu lại bản đồ ID -> Path để hiển thị ngay lập tức
      setUploadedMap(prev => ({ 
        ...prev, 
        [responseId]: { thumb: responsePath, origin: originalPath } 
      }));

      if (maxCount === 1) {
        onChange?.(responseId);
      } else {
        onChange?.(newFileList.map((f) => f.response.id).filter(Boolean));
      }

      onSuccess?.(newFile);
    } catch (err: any) {
      msg.error(t('common.messages.error'));
      onError?.(err);
    }
  };

  const onRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    if (maxCount === 1) {
      onChange?.('');
    } else {
      onChange?.(newFileList.map((f) => f.response?.id).filter(Boolean));
    }
    return true;
  };

  const handlePreview = async (file: UploadFile) => {
    let previewUrl = file.url;
    
    if (file.response?.originalPath) {
      previewUrl = getFullImageUrl(file.response.originalPath);
    } else if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    
    setPreviewImage(previewUrl || (file.preview as string));
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
        className={`app-media-upload ${className || ''}`}
        accept="image/*"
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: true,
          previewIcon: <EyeOutlined />,
          removeIcon: <DeleteOutlined />,
        }}
        style={style}
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
