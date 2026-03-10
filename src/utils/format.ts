import dayjs from 'dayjs';
import i18n from '@/i18n';

/**
 * Interface definition for language-specific formatting configurations.
 */
interface FormatConfig {
  locale: string;
  currency: string;
  dateFormat: string;
  dateTimeFormat: string;
}

/**
 * Centralized formatting configurations for all supported languages.
 * To add a new language, simply add its configuration here.
 */
const FORMAT_CONFIGS: Record<string, FormatConfig> = {
  vi: {
    locale: 'vi-VN',
    currency: 'VND',
    dateFormat: 'DD/MM/YYYY',
    dateTimeFormat: 'DD/MM/YYYY HH:mm',
  },
  en: {
    locale: 'en-US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    dateTimeFormat: 'MM/DD/YYYY HH:mm',
  },
  // Example: Add Japanese support
  // ja: {
  //   locale: 'ja-JP',
  //   currency: 'JPY',
  //   dateFormat: 'YYYY/MM/DD',
  //   dateTimeFormat: 'YYYY/MM/DD HH:mm',
  // },
};

/**
 * Fallback configuration if the current language is not defined above.
 */
const DEFAULT_CONFIG: FormatConfig = FORMAT_CONFIGS.vi;

/**
 * Internal helper to get active formatting configuration.
 * Makes it easy to debug and trace which config is being used.
 */
const getActiveConfig = (): FormatConfig => {
  const currentLang = (i18n.language || 'vi').split('-')[0];
  const config = FORMAT_CONFIGS[currentLang] || DEFAULT_CONFIG;
  return config;
};

/**
 * Format number to currency style based on active language configuration.
 */
export const formatCurrency = (amount: number | string = 0): string => {
  try {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return '0';

    const { locale, currency } = getActiveConfig();

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.error('[FormatUtil] Error formatting currency:', error);
    return String(amount);
  }
};

/**
 * Format date based on active language configuration.
 */
export const formatDate = (date: string | number | Date): string => {
  if (!date) return '';
  const { dateFormat } = getActiveConfig();
  return dayjs(date).format(dateFormat);
};

/**
 * Format time (standardized across languages).
 */
export const formatTime = (date: string | number | Date): string => {
  if (!date) return '';
  return dayjs(date).format('HH:mm:ss');
};

/**
 * Format date & time based on active language configuration.
 */
export const formatDateTime = (date: string | number | Date): string => {
  if (!date) return '';
  const { dateTimeFormat } = getActiveConfig();
  return dayjs(date).format(dateTimeFormat);
};

/**
 * Format time relative to now (e.g., "5 minutes ago", "Yesterday", or full date)
 */
export const formatRelativeTime = (date: string | number | Date): string => {
  if (!date) return '';
  const now = dayjs();
  const target = dayjs(date);
  const diffInMinutes = now.diff(target, 'minute');
  const diffInHours = now.diff(target, 'hour');
  const { dateTimeFormat } = getActiveConfig();

  // 1. Under 1 minute
  if (diffInMinutes < 1) {
    return i18n.t('common.formats.relativeTime.justNow');
  }

  // 2. Under 60 minutes
  if (diffInMinutes < 60) {
    return i18n.t('common.formats.relativeTime.minutesAgo', { count: diffInMinutes });
  }

  // 3. Under 24 hours (today)
  if (diffInHours < 24 && now.isSame(target, 'day')) {
    return i18n.t('common.formats.relativeTime.hoursAgo', { count: diffInHours });
  }

  // 4. Yesterday
  const yesterday = now.subtract(1, 'day');
  if (yesterday.isSame(target, 'day')) {
    return i18n.t('common.formats.relativeTime.yesterday', { time: target.format('HH:mm') });
  }

  // 5. Older: Full date or Date + Time
  return target.format(dateTimeFormat);
};

/**
 * Format chart x-axis labels based on type and language.
 */
export const formatChartLabel = (label: string, type: 'day' | 'hour' | 'weekday'): string => {
  if (!label) return '';
  const { dateFormat } = getActiveConfig();

  switch (type) {
    case 'hour':
      const hourSuffix = i18n.t('common.formats.chart.hourSuffix');
      return `${parseInt(label)}${hourSuffix}`;
    
    case 'weekday':
      const weekdays = i18n.t('common.formats.chart.weekdays', { returnObjects: true }) as string[];
      // API labels: 1 (Sun), 2 (Mon), ..., 7 (Sat)
      // Our array: index 0 (Mon), ..., index 6 (Sun)
      // Conversion: 1->6, 2->0, 3->1, 4->2, 5->3, 6->4, 7->5
      const dayNum = parseInt(label);
      const dayIndex = (dayNum + 5) % 7;
      return weekdays[dayIndex] || label;

    case 'day':
    default:
      // API returns "YYYY-MM-DD"
      return dayjs(label).format(dateFormat);
  }
};
