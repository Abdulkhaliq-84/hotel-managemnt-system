import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Room } from '../types/room.types';
import CurrencyDisplay from '../../../components/CurrencyDisplay';
import './RoomForm.css';

interface RoomFormProps {
  room?: Room;
  onSave: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'lastCleaned' | 'nextCleaning'>) => void;
  onCancel: () => void;
  className?: string;
}

const RoomForm: React.FC<RoomFormProps> = ({
  room,
  onSave,
  onCancel,
  className = ''
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'single' as Room['roomType'],
    floor: 1,
    price: 0,
    capacity: 1,
    amenities: [] as string[],
    description: '',
    status: 'available' as Room['status'],
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amenitiesInput, setAmenitiesInput] = useState('');

  const roomTypes = [
    { value: 'single', label: t('rooms.types.single') },
    { value: 'double', label: t('rooms.types.double') },
    { value: 'suite', label: t('rooms.types.suite') },
    { value: 'deluxe', label: t('rooms.types.deluxe') }
  ];

  const statusOptions = [
    { value: 'available', label: t('rooms.status.available') },
    { value: 'occupied', label: t('rooms.status.occupied') },
    { value: 'maintenance', label: t('rooms.status.maintenance') },
    { value: 'cleaning', label: t('rooms.status.cleaning') },
    { value: 'reserved', label: t('rooms.status.reserved') }
  ];

  const commonAmenities = [
    t('rooms.amenities.wifi'),
    t('rooms.amenities.tv'),
    t('rooms.amenities.airConditioning'),
    t('rooms.amenities.miniBar'),
    t('rooms.amenities.roomService'),
    t('rooms.amenities.balcony'),
    t('rooms.amenities.oceanView'),
    t('rooms.amenities.mountainView'),
    t('rooms.amenities.kitchen'),
    t('rooms.amenities.jacuzzi'),
    t('rooms.amenities.workDesk'),
    t('rooms.amenities.safe'),
    t('rooms.amenities.iron'),
    t('rooms.amenities.hairDryer'),
    t('rooms.amenities.coffeeMaker')
  ];

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        floor: room.floor,
        price: room.price,
        capacity: room.capacity,
        amenities: room.amenities,
        description: room.description,
        status: room.status,
        isActive: room.isActive
      });
    }
  }, [room]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = t('rooms.validation.roomNumberRequired');
    } else if (!/^[A-Z0-9-]+$/i.test(formData.roomNumber.trim())) {
      newErrors.roomNumber = t('rooms.validation.roomNumberFormat');
    }

    if (formData.floor < 1) {
      newErrors.floor = t('rooms.validation.floorMin');
    } else if (formData.floor > 100) {
      newErrors.floor = t('rooms.validation.floorMax');
    }

    if (formData.price < 0) {
      newErrors.price = t('rooms.validation.priceMin');
    } else if (formData.price > 10000) {
      newErrors.price = t('rooms.validation.priceMax');
    }

    if (formData.capacity < 1) {
      newErrors.capacity = t('rooms.validation.capacityMin');
    } else if (formData.capacity > 10) {
      newErrors.capacity = t('rooms.validation.capacityMax');
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = t('rooms.validation.descriptionMax');
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
      console.error('Error saving room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddCustomAmenity = () => {
    if (amenitiesInput.trim() && !formData.amenities.includes(amenitiesInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenitiesInput.trim()]
      }));
      setAmenitiesInput('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };


  return (
    <div className={`rooms-form-container ${className}`}>
      <div className="rooms-form-wrapper">
        <h2 className="rooms-form-title form-title">
          {room ? t('rooms.editRoom') : t('rooms.createRoom')}
        </h2>
        
        <form onSubmit={handleSubmit} className="rooms-form">
          <div className="rooms-form-grid">
            {/* Basic Information */}
            <div className="rooms-form-section">
              <h3 className="rooms-form-section-title section-title">{t('rooms.form.basicInfo')}</h3>
              
              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.roomNumber')} *</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  className={`rooms-form-input ${errors.roomNumber ? 'error' : ''}`}
                  placeholder={t('rooms.form.roomNumberPlaceholder')}
                />
                {errors.roomNumber && <span className="rooms-form-error-message">{errors.roomNumber}</span>}
              </div>

              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.roomType')} *</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => handleInputChange('roomType', e.target.value as Room['roomType'])}
                  className="rooms-form-select"
                >
                  {roomTypes.map(roomType => (
                    <option key={roomType.value} value={roomType.value}>
                      {roomType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.floor')} *</label>
                <input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', parseInt(e.target.value))}
                  className={`rooms-form-input ${errors.floor ? 'error' : ''}`}
                  min="1"
                  max="100"
                />
                {errors.floor && <span className="rooms-form-error-message">{errors.floor}</span>}
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="rooms-form-section">
              <h3 className="rooms-form-section-title section-title">{t('rooms.form.pricingCapacity')}</h3>
              
              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.form.pricePerNight')} *</label>
                <div className="rooms-form-price-input">
                  <span className="rooms-form-currency">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className={`rooms-form-input ${errors.price ? 'error' : ''}`}
                    min="0"
                    max="10000"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <span className="rooms-form-error-message">{errors.price}</span>}
                <div className="rooms-form-price-display">
                  <CurrencyDisplay amount={formData.price} /> {t('rooms.stats.perNight')}
                </div>
              </div>

              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.capacity')} *</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className={`rooms-form-input ${errors.capacity ? 'error' : ''}`}
                  min="1"
                  max="10"
                />
                {errors.capacity && <span className="rooms-form-error-message">{errors.capacity}</span>}
                <span className="rooms-form-help-text">
                  {t('rooms.form.capacityHelp')}
                </span>
              </div>
            </div>

            {/* Status & Settings */}
            <div className="rooms-form-section">
              <h3 className="rooms-form-section-title section-title">{t('rooms.form.statusSettings')}</h3>
              
              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('common.status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as Room['status'])}
                  className="rooms-form-select"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rooms-form-group">
                <label className="rooms-form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rooms-form-checkbox"
                  />
                  <span className="rooms-form-checkbox-text">{t('rooms.form.roomActiveLabel')}</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="rooms-form-section">
              <h3 className="rooms-form-section-title section-title">{t('rooms.form.description')}</h3>
              
              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.form.roomDescription')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`rooms-form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder={t('rooms.form.descriptionPlaceholder')}
                  rows={4}
                  maxLength={500}
                />
                {errors.description && <span className="rooms-form-error-message">{errors.description}</span>}
                <span className="rooms-form-character-count">
                  {formData.description.length}/500 {t('common.characters')}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="rooms-form-section rooms-form-amenities-section">
              <h3 className="rooms-form-section-title section-title">{t('rooms.form.amenities')}</h3>
              
              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.form.commonAmenities')}</label>
                <div className="rooms-form-amenities-grid">
                  {commonAmenities.map(amenity => (
                    <label key={amenity} className="rooms-form-amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="rooms-form-checkbox"
                      />
                      <span className="rooms-form-amenity-text">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rooms-form-group">
                <label className="rooms-form-label form-label">{t('rooms.form.customAmenities')}</label>
                <div className="rooms-form-custom-amenity">
                  <input
                    type="text"
                    value={amenitiesInput}
                    onChange={(e) => setAmenitiesInput(e.target.value)}
                    className="rooms-form-input"
                    placeholder={t('rooms.form.addCustomAmenity')}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomAmenity())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAmenity}
                    className="rooms-form-add-amenity-btn"
                    disabled={!amenitiesInput.trim()}
                  >
                    {t('common.add')}
                  </button>
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div className="rooms-form-group">
                  <label className="rooms-form-label form-label">{t('rooms.form.selectedAmenities')}</label>
                  <div className="rooms-form-selected-amenities">
                    {formData.amenities.map(amenity => (
                      <span key={amenity} className="rooms-form-amenity-tag">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(amenity)}
                          className="rooms-form-amenity-remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rooms-form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="rooms-form-cancel-btn"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="rooms-form-save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.saving') : (room ? t('rooms.updateRoom') : t('rooms.createRoom'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
