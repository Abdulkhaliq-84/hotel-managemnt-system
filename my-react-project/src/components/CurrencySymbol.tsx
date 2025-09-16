import SaudiRiyalSymbol from '../assets/Saudi_Riyal_Symbol.png';
import './CurrencySymbol.css';

interface CurrencySymbolProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const CurrencySymbol: React.FC<CurrencySymbolProps> = ({ 
  className = '', 
  size = 'medium' 
}) => {
  // Always use Saudi Riyal symbol as the currency for this hotel system
  return (
    <img 
      src={SaudiRiyalSymbol} 
      alt="SAR" 
      className={`currency-symbol currency-symbol-${size} ${className}`}
      title="Saudi Riyal"
    />
  );
};

export default CurrencySymbol;
