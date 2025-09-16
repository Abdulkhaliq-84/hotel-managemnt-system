import React from 'react';
import { useTranslation } from 'react-i18next';
import riyalSymbol from '../assets/Saudi_Riyal_Symbol.png';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({ 
  amount, 
  className = '', 
  size = 'medium' 
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const formattedAmount = amount.toFixed(2);
  
  // Define size classes for the riyal symbol
  const sizeClasses = {
    small: 'riyal-small',
    medium: 'riyal-medium',
    large: 'riyal-large'
  };
  
  if (isArabic) {
    return (
      <span className={`currency-display currency-arabic ${className}`}>
        <span className="currency-amount">{formattedAmount}</span>
        <img 
          src={riyalSymbol} 
          alt="SAR" 
          className={`riyal-symbol ${sizeClasses[size]}`}
        />
      </span>
    );
  }
  
  return (
    <span className={`currency-display ${className}`}>
      ${formattedAmount}
    </span>
  );
};

export default CurrencyDisplay;
