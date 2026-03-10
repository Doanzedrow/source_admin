import React from 'react';
import CachedImage from '@/components/common/CachedImage/CachedImage';
import { APP_ASSETS } from '@/config/assets';
import './PageLoader.less';

export const PageLoader: React.FC = () => {
  return (
    <div className="page-loader-wrapper">
      <div className="pulse-loader">
        <CachedImage 
          src={APP_ASSETS.LOGO_PRIMARY} 
          alt="Loading..." 
          className="pulse-logo"
        />
      </div>
    </div>
  );
};
