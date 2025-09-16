import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Guest } from '../types/guest.types';
import './GuestForm.css';

interface GuestFormProps {
  guest?: Guest;
  onSave: (guest: Omit<Guest, 'id' | 'totalStays' | 'totalSpent' | 'lastVisit' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  className?: string;
}

const GuestForm: React.FC<GuestFormProps> = ({
  guest,
  onSave,
  onCancel,
  className = ''
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    isActive: true,
    preferences: {
      roomType: 'single' as Guest['preferences']['roomType'],
      floor: 'any' as Guest['preferences']['floor'],
      smoking: false,
      specialRequests: [] as string[]
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');

  const roomTypes = [
    { value: 'single', label: t('rooms.single') },
    { value: 'double', label: t('rooms.double') },
    { value: 'suite', label: t('rooms.suite') },
    { value: 'deluxe', label: t('rooms.deluxe') }
  ];

  const floorPreferences = [
    { value: 'low', label: t('guests.floorLow') },
    { value: 'high', label: t('guests.floorHigh') },
    { value: 'any', label: t('guests.floorAny') }
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy',
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
    'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
    'Turkey', 'Russia', 'Ukraine', 'Belarus', 'Latvia', 'Lithuania', 'Estonia',
    'Australia', 'New Zealand', 'Japan', 'South Korea', 'China', 'India', 'Singapore',
    'Malaysia', 'Thailand', 'Vietnam', 'Philippines', 'Indonesia', 'Brazil', 'Argentina',
    'Chile', 'Mexico', 'Colombia', 'Peru', 'Venezuela', 'Uruguay', 'Paraguay',
    'South Africa', 'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan',
    'Ethiopia', 'Kenya', 'Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Cameroon',
    'Other'
  ];

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        dateOfBirth: guest.dateOfBirth || '',
        country: guest.country,
        isActive: guest.isActive,
        preferences: {
          roomType: guest.preferences.roomType,
          floor: guest.preferences.floor,
          smoking: guest.preferences.smoking,
          specialRequests: [...guest.preferences.specialRequests]
        }
      });
    }
  }, [guest]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('validation.required');
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = t('validation.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('validation.invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('validation.required');
    }

    if (!formData.country.trim()) {
      newErrors.country = t('validation.required');
    }

    // Validate date of birth if provided
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 0) {
        newErrors.dateOfBirth = t('validation.futureDate');
      } else if (age > 120) {
        newErrors.dateOfBirth = t('guests.invalidDateOfBirth');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving guest:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePreferenceChange = (field: keyof Guest['preferences'], value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const addSpecialRequest = () => {
    if (specialRequest.trim()) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          specialRequests: [...prev.preferences.specialRequests, specialRequest.trim()]
        }
      }));
      setSpecialRequest('');
    }
  };

  const removeSpecialRequest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        specialRequests: prev.preferences.specialRequests.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className={`guest-form-container ${className}`}>
      <div className="form-wrapper">
        <h2 className="form-title">
          {guest ? t('guests.editGuest') : t('guests.addGuest')}
        </h2>
        
        <form onSubmit={handleSubmit} className="guest-form">
          <div className="form-grid">
            {/* Personal Information */}
            <div className="form-section">
              <h3 className="section-title">{t('guests.personalInfo')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('guests.firstName')} *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder={t('guests.firstNamePlaceholder')}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.lastName')} *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder={t('guests.lastNamePlaceholder')}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.email')} *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder={t('guests.emailPlaceholder')}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.phone')} *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder={t('guests.phonePlaceholder')}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3 className="section-title">{t('guests.additionalInfo')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('guests.dateOfBirth')}</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.country')} *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className={`form-select ${errors.country ? 'error' : ''}`}
                >
                  <option value="">{t('guests.selectCountry')}</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">{t('common.status')}</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="isActive" className="checkbox-label">
                    {t('guests.activeGuest')}
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="form-section">
              <h3 className="section-title">{t('guests.roomPreferences')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('guests.preferredRoomType')}</label>
                <select
                  value={formData.preferences.roomType}
                  onChange={(e) => handlePreferenceChange('roomType', e.target.value as Guest['preferences']['roomType'])}
                  className="form-select"
                >
                  {roomTypes.map(roomType => (
                    <option key={roomType.value} value={roomType.value}>
                      {roomType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.floorPreference')}</label>
                <select
                  value={formData.preferences.floor}
                  onChange={(e) => handlePreferenceChange('floor', e.target.value as Guest['preferences']['floor'])}
                  className="form-select"
                >
                  {floorPreferences.map(floor => (
                    <option key={floor.value} value={floor.value}>
                      {floor.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('guests.smokingPreference')}</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="smoking"
                    checked={formData.preferences.smoking}
                    onChange={(e) => handlePreferenceChange('smoking', e.target.checked)}
                    className="form-checkbox"
                  />
                  <label htmlFor="smoking" className="checkbox-label">
                    {t('guests.smokingRoomPreferred')}
                  </label>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="form-section">
              <h3 className="section-title">{t('guests.specialRequests')}</h3>
              
              <div className="form-group">
                <label className="form-label">{t('guests.addSpecialRequest')}</label>
                <div className="special-request-input">
                  <input
                    type="text"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="form-input"
                    placeholder={t('guests.specialRequestPlaceholder')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialRequest())}
                  />
                  <button
                    type="button"
                    onClick={addSpecialRequest}
                    className="add-request-btn"
                    disabled={!specialRequest.trim()}
                  >
                    {t('common.add')}
                  </button>
                </div>
              </div>

              {formData.preferences.specialRequests.length > 0 && (
                <div className="form-group">
                  <label className="form-label">{t('guests.currentRequests')}</label>
                  <div className="special-requests-list">
                    {formData.preferences.specialRequests.map((request, index) => (
                      <div key={index} className="request-item">
                        <span className="request-text">{request}</span>
                        <button
                          type="button"
                          onClick={() => removeSpecialRequest(index)}
                          className="remove-request-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-btn"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.saving') : (guest ? t('guests.updateGuest') : t('guests.createGuest'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestForm;
