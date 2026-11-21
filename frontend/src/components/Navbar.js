import React from 'react';

export default function Navbar({ 
  activeNav, 
  setActiveNav, 
  isDarkMode, 
  toggleTheme, 
  onOpenAddModal,
  currentUser,
  onSignOut
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'transactions', label: 'Transactions', icon: 'bi-arrow-left-right', badge: 'Live' },
    { id: 'accounts', label: 'Accounts', icon: 'bi-wallet2' },
    { id: 'budgets', label: 'Budgets & Limits', icon: 'bi-pie-chart-fill' },
    { id: 'ai-intelligence', label: 'AI Intelligence Hub', icon: 'bi-cpu-fill', highlight: true },
    { id: 'reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph' },
  ];

  return (
    <nav className="navbar navbar-expand-xl navbar-top-pro sticky-top px-3 px-xl-4">
      <div className="container-fluid px-0">
        {/* Brand Logo & Roman Title */}
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveNav(currentUser ? 'dashboard' : 'intro'); }} 
          className="navbar-brand d-flex align-items-center gap-2 me-3 text-decoration-none"
        >
          <div
            className="d-flex align-items-center justify-content-center rounded-2 text-white bg-primary"
            style={{ width: '34px', height: '34px' }}
          >
            <i className="bi bi-wallet2 fs-6"></i>
          </div>
          <div>
            <span className="fw-bold fs-5 tracking-tight" style={{ color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
              FinIntel <span className="badge bg-primary text-white ms-1 px-1.5 py-0.5" style={{ fontSize: '9px' }}>AI v1.0</span>
            </span>
          </div>
        </a>

        {/* Responsive Mobile Hamburger Toggler */}
        <button
          className="navbar-toggler border-0 p-1.5 ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topNavbarCollapse"
          aria-controls="topNavbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ color: 'var(--text-main)' }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Collapsible Top Navigation Links & Actions (Mobile Responsive) */}
        <div className="collapse navbar-collapse mt-2 mt-xl-0" id="topNavbarCollapse">
          {/* Main Horizontal Navigation Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-xl-0 gap-1 gap-xl-2">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(item.id);
                    }}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 py-0.5 px-1.5 ms-1" style={{ fontSize: '9px' }}>
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <i className="bi bi-stars text-warning small ms-1"></i>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right Action Utilities (Border-Top Removed to Prevent Overhead Line Artifacts) */}
          <div className="d-flex flex-wrap align-items-center gap-2 pt-2 pt-xl-0">
            {/* Theme Switcher Toggle Button (Segmented Sun/Moon Pill) */}
            <button
              onClick={toggleTheme}
              className="theme-switch-btn"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              type="button"
              aria-label="Toggle Theme"
            >
              <span className={`theme-pill-option ${!isDarkMode ? 'active' : ''}`}>
                <i className="bi bi-sun-fill text-warning"></i>
              </span>
              <span className={`theme-pill-option ${isDarkMode ? 'active' : ''}`}>
                <i className="bi bi-moon-stars-fill text-primary"></i>
              </span>
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={onOpenAddModal}
              className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold"
              type="button"
            >
              <i className="bi bi-plus-lg"></i>
              <span>Add Entry</span>
            </button>

            {/* Interactive User Auth Status / Sign In & Register Controls */}
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-none d-sm-flex align-items-center justify-content-center rounded-circle fw-bold bg-primary text-white shadow-sm"
                  style={{ width: '34px', height: '34px', fontSize: '11px', flexShrink: 0, letterSpacing: '0.5px' }}
                  title={`${currentUser.name} (${currentUser.email})`}
                >
                  {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AV'}
                </div>
                <button
                  onClick={onSignOut}
                  className="btn btn-sm btn-outline-secondary py-1 px-2.5 text-truncate"
                  style={{ fontSize: '11px' }}
                  title="Sign Out of Account"
                  type="button"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  <span className="d-none d-md-inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-1.5">
                <button
                  onClick={() => setActiveNav('login')}
                  className={`btn btn-sm py-1.5 px-2.5 fw-semibold d-flex align-items-center gap-1 ${
                    activeNav === 'login' ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  type="button"
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => setActiveNav('register')}
                  className={`btn btn-sm py-1.5 px-2.5 fw-semibold d-flex align-items-center gap-1 ${
                    activeNav === 'register' ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  type="button"
                >
                  <i className="bi bi-person-plus-fill"></i>
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
