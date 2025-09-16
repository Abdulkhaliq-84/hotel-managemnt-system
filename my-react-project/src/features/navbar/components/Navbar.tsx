import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import './Navbar.css';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  return (
    <nav className={`navbar ${className}`}>
      <div className="navbar-container">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">Hotel Manager</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            {t('navigation.dashboard')}
          </Link>
          <Link to="/reservations" className={`nav-link ${location.pathname === '/reservations' ? 'active' : ''}`}>
            {t('navigation.reservations')}
          </Link>
          <Link to="/guests" className={`nav-link ${location.pathname === '/guests' ? 'active' : ''}`}>
            {t('navigation.guests')}
          </Link>
          <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>
            {t('navigation.rooms')}
          </Link>
          <Link to="/reports" className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}>
            {t('navigation.reports')}
          </Link>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Notification Bell */}
          <div className="notification-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

                     {/* User Profile */}
           <div className="user-profile">
             <div className="profile-avatar">
               <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="16" cy="16" r="16" fill="#ffffff"/>
                 <circle cx="16" cy="12" r="4" fill="#1e40af"/>
                 <path d="M8 24C8 20 11.5 18 16 18C20.5 18 24 20 24 24" fill="#1e40af"/>
               </svg>
             </div>
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
