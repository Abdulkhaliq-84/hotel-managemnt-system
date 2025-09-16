import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import ActivityTable from './ActivityTable';
import { apiService } from '../../../services/api';
import { useToast } from '../../../hooks/useToast';
import ToastContainer from '../../../components/ToastContainer';
import { CurrencyDisplay } from '../../../utils/currency';

interface DashboardProps {
  className?: string;
}

interface DashboardStats {
  checkIns: number;
  checkOuts: number;
  occupancy: number;
  revenue: number;
  newBookings: number;
  maintenance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    checkIns: 0,
    checkOuts: 0,
    occupancy: 0,
    revenue: 0,
    newBookings: 0,
    maintenance: 0
  });
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, error: showError } = useToast();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch reservations and rooms data
        const [reservations, rooms] = await Promise.all([
          apiService.getReservations(),
          apiService.getRooms()
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Calculate stats
        const checkIns = reservations.filter(r => {
          const checkInDate = new Date(r.checkInDate);
          return checkInDate >= today && checkInDate < tomorrow && r.status === 'CheckedIn';
        }).length;

        const checkOuts = reservations.filter(r => {
          const checkOutDate = new Date(r.checkOutDate);
          return checkOutDate >= today && checkOutDate < tomorrow && r.status === 'CheckedOut';
        }).length;

        const totalRooms = rooms.length;
        const occupiedRooms = reservations.filter(r => 
          r.status === 'CheckedIn' || r.status === 'Confirmed'
        ).length;
        const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        const todayRevenue = reservations
          .filter(r => {
            const checkInDate = new Date(r.checkInDate);
            return checkInDate >= today && checkInDate < tomorrow;
          })
          .reduce((sum, r) => sum + r.totalPrice, 0);

        // Note: ReservationSummary doesn't include createdAt, so we'll use check-in date as proxy
        const newBookings = reservations.filter(r => {
          const checkInDate = new Date(r.checkInDate);
          return checkInDate >= today && checkInDate < tomorrow;
        }).length;

        const maintenance = rooms.filter(r => !r.isAvailable).length;

        setStats({
          checkIns,
          checkOuts,
          occupancy,
          revenue: todayRevenue,
          newBookings,
          maintenance
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        showError('Dashboard Error', errorMessage);
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={`dashboard ${className}`}>
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard ${className}`}>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <div className="dashboard-container">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        
        <div className="dashboard-grid">
          {/* Check-ins Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.checkIn')}</h3>
              <p className="card-number">{stats.checkIns}</p>
              <p className="card-description">{t('dashboard.todayCheckIns')}</p>
            </div>
          </div>

          {/* Check-outs Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.checkOut')}</h3>
              <p className="card-number">{stats.checkOuts}</p>
              <p className="card-description">{t('dashboard.todayCheckOuts')}</p>
            </div>
          </div>

          {/* Occupancy Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.occupancyRate')}</h3>
              <p className="card-number">{stats.occupancy}%</p>
              <p className="card-description">{t('dashboard.occupiedRooms')}</p>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.totalRevenue')}</h3>
              <div className="card-number">
                <CurrencyDisplay amount={stats.revenue} size="large" />
              </div>
              <p className="card-description">{t('dashboard.totalRevenue')}</p>
            </div>
          </div>

          {/* Reservations Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.newReservation')}</h3>
              <p className="card-number">{stats.newBookings}</p>
              <p className="card-description">{t('dashboard.recentReservations')}</p>
            </div>
          </div>

          {/* Maintenance Card */}
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3C14.7 6.3 14.7 6.3 14.7 6.3C14.7 6.3 14.7 6.3 14.7 6.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.4 9C17.4 9 17.4 9 17.4 9C17.4 9 17.4 9 17.4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.1 11.7C20.1 11.7 20.1 11.7 20.1 11.7C20.1 11.7 20.1 11.7 20.1 11.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 3L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">{t('dashboard.maintenance')}</h3>
              <p className="card-number">{stats.maintenance}</p>
              <p className="card-description">{t('dashboard.underMaintenance')}</p>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <ActivityTable />
      </div>
    </div>
  );
};

export default Dashboard;
