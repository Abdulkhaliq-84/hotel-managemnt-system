import React from 'react';
import { useTranslation } from 'react-i18next';
import CurrencySymbol from '../components/CurrencySymbol';
import './currency.css';

export const formatCurrency = (
  amount: number, 
  language: string = 'en'
): string => {
  // Use ar-EG for Arabic to keep Gregorian numbers but with Arabic formatting
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  
  // Format the number with appropriate locale but without currency symbol
  // since we're using the Saudi Riyal image
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
  
  return formattedNumber;
};

// Component that renders currency with symbol
export const CurrencyDisplay: React.FC<{ 
  amount: number; 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}> = ({ amount, size = 'medium', className = '' }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const formattedAmount = formatCurrency(amount, i18n.language);
  
  return (
    <span className={`currency-display ${isArabic ? 'currency-arabic' : ''} ${className}`}>
      <CurrencySymbol size={size} />
      <span className={isArabic ? 'arabic-text' : ''}>{formattedAmount}</span>
    </span>
  );
};
