import { memo } from 'react';
import { SEO } from '@/components/common/SEO/SEO';
import { useTranslation } from 'react-i18next';
import { CategoryForm } from '../components/CategoryForm';

const CategoryEdit = () => {
  const { t } = useTranslation('category');

  return (
    <div className="category-form-page">
      <SEO title={t('titleEdit')} />
      <CategoryForm isEdit />
    </div>
  );
};

export default memo(CategoryEdit);
