import React from 'react';

export default function Sidebar({ sidebarOpen, activeNav, setActiveNav }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { id: 'transactions', label: 'Transactions', icon: 'bi-arrow-left-right', badge: 'Live' },
    { id: 'accounts', label: 'Accounts & Cards', icon: 'bi-wallet2' },
    { id: 'budgets', label: 'Budgets & Limits', icon: 'bi-pie-chart-fill' },
    { id: 'ai-intelligence', label: 'AI Intelligence Hub', icon: 'bi-cpu-fill', highlight: true },
    { id: 'reports', label: 'Reports & Export', icon: 'bi-file-earmark-bar-graph' },
  ];

  return (
    <aside className={`custom-sidebar ${sidebarOpen ? '' : 'collapsed'} d-flex flex-column justify-content-between p-3`}>
      <div>
        <div className="mb-3 px-2">
          {sidebarOpen ? (
            <span
              className="text-uppercase fw-semibold"
              style={{ fontSize: '10px', letterSpacing: '0.8px', color: 'var(--text-muted)' }}
            >
              Main Navigation
            </span>
          ) : (
            <div style={{ height: '14px' }}></div>
          )}
        </div>

        <nav>
          {menuItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveNav(item.id);
                }}
                className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : ''}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                {sidebarOpen && (
                  <div className="d-flex align-items-center justify-content-between flex-grow-1">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="badge bg-primary-subtle text-primary border border-primary border-opacity-25 py-0.5 px-1.5" style={{ fontSize: '9px' }}>
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <i className="bi bi-stars text-warning small"></i>
                    )}
                  </div>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="p-3 rounded-3"
          style={{
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--card-border)',
            fontSize: '11.5px',
          }}
        >
          <div className="d-flex align-items-center gap-1.5 mb-1 fw-bold text-primary">
            <i className="bi bi-shield-check"></i>
            <span>VCUBE Hack Quest 1.0</span>
          </div>
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Problem 5 • FinTech Platform with 5 Tables & 4 AI Models.
          </div>
        </div>
      )}
    </aside>
  );
}
