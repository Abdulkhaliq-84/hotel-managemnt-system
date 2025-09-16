import './App.css'
import './styles/arabic-styles.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './features/navbar'
import { Dashboard } from './features/dashboard'
import { ReservationPage } from './features/reservations'
import { GuestPage } from './features/guests'
import { RoomPage } from './features/rooms'
import { ReportsPage } from './features/reports'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    console.log('App component mounted');
  }, []);
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/guests" element={<GuestPage />} />
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2025 Hotel Management System. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
