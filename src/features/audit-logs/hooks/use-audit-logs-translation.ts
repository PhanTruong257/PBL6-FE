import { useTranslation } from 'react-i18next';

/**
 * Hook for accessing audit-logs translations.
 * @returns Translation function and i18n instance
 */
export const useAuditLogsTranslation = () => {
  const { t, i18n } = useTranslation('audit-logs');
  return { t, i18n };
};
