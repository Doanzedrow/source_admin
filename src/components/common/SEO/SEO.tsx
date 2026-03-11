import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/config/constants';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  author = APP_NAME,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
}) => {
  const pageTitle = title ? `${title} - ${APP_NAME}` : APP_NAME;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={ogTitle || pageTitle} />
      {description && <meta property="og:description" content={ogDescription || description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || pageTitle} />
      {description && <meta name="twitter:description" content={ogDescription || description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};
