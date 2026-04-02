import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import NewOrderPage from './pages/NewOrderPage';
import OrdersListPage from './pages/OrdersListPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="1" width="12" height="16" rx="1" />
                  <path d="M6 8H2a1 1 0 00-1 1v9a1 1 0 001 1h20a1 1 0 001-1V9a1 1 0 00-1-1h-4" />
                  <circle cx="18" cy="13" r="1" />
                  <path d="M6 19v4h12v-4" />
                </svg>
              </div>
              <span className="brand-name">PrintDesk</span>
            </div>
            <nav className="nav">
              <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                New Order
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                All Orders
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<NewOrderPage />} />
            <Route path="/orders" element={<OrdersListPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>PrintDesk &copy; {new Date().getFullYear()} — Professional Print Order Management</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
