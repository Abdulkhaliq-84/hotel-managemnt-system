/**
 * Date formatting utilities
 * Uses Gregorian calendar for both English and Arabic locales
 */

export const formatDate = (
  dateString: string | Date,
  language: string = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string => {
  // Use ar-EG for Arabic with Gregorian calendar instead of ar-SA which uses Hijri
  // ar-EG uses Arabic month names but with Gregorian calendar (يناير، فبراير، etc.)
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleDateString(locale, options);
};

export const formatShortDate = (
  dateString: string | Date,
  language: string = 'en'
): string => {
  return formatDate(dateString, language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatLongDate = (
  dateString: string | Date,
  language: string = 'en'
): string => {
  return formatDate(dateString, language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

export const formatDateTime = (
  dateString: string | Date,
  language: string = 'en'
): string => {
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format date for input fields (YYYY-MM-DD)
export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }
  return d.toISOString().split('T')[0];
};
